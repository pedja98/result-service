import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateAttemptDto } from './dto/create-attempt.dto'
import { Attempt } from './entities/attempt.entity'
import { Answer } from '../answers/entities/answer.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { AuthUser } from 'src/types/auth-user.types'
import { AttemptStatus } from './enums/attempt-status.enum'
import { AttemptResponse } from './types/attempt-response.types'
import { SubmitAttemptDto } from './dto/submit-attempt.dto'
import { AnswersService } from '../answers/answers.service'
import { toSafeAnswer } from '../answers/helpers/answers.helpers'

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    private readonly dataSource: DataSource,
    private readonly answersService: AnswersService,
  ) {}

  async create(dto: CreateAttemptDto, user: AuthUser): Promise<AttemptResponse> {
    const lastAttempt = await this.attemptRepository.findOne({
      where: { userId: user.id, quizId: dto.quizId },
      order: { attemptNumber: 'DESC' },
    })

    const expiresAt = new Date(Date.now() + dto.duration)

    return this.dataSource.transaction(async (manager) => {
      const attempt = manager.create(Attempt, {
        userId: user.id,
        quizId: dto.quizId,
        totalQuestions: dto.questions.length,
        attemptNumber: (lastAttempt?.attemptNumber ?? 0) + 1,
        expiresAt,
      })
      const savedAttempt = await manager.save(Attempt, attempt)

      const answers = dto.questions.map((q) =>
        manager.create(Answer, {
          attemptId: savedAttempt.id,
          questionId: q.questionId,
          text: q.text,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          selectedOptionIndex: null,
          isCorrect: false,
        }),
      )

      savedAttempt.answers = await manager.save(Answer, answers)

      return this.sanitizeAttempt(savedAttempt)
    })
  }

  async findAll(user: AuthUser, quizId?: number): Promise<Attempt[]> {
    return this.attemptRepository.find({
      select: {
        id: true,
        quizId: true,
        userId: true,
        score: true,
        totalQuestions: true,
        attemptNumber: true,
      },
      where: {
        userId: user.id,
        ...(quizId ? { quizId } : {}),
      },
      relations: {
        answers: false,
      },
      order: {
        createdAt: 'DESC',
      },
    })
  }

  async findOne(id: number, user: AuthUser): Promise<AttemptResponse> {
    const attempt = await this.attemptRepository.findOne({
      where: { id, userId: user.id },
      relations: { answers: true },
    })

    if (!attempt) {
      throw new NotFoundException(`Attempt #${id} not found`)
    }

    return this.sanitizeAttempt(attempt)
  }

  private sanitizeAttempt(attempt: Attempt): AttemptResponse {
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      return attempt
    }

    return {
      ...attempt,
      answers: attempt.answers.map((answer) => {
        return toSafeAnswer(answer)
      }),
    }
  }

  async submit(dto: SubmitAttemptDto, user: AuthUser) {
    const attempt = await this.attemptRepository.findOne({
      where: { id: dto.attemptId },
      relations: ['answers'],
    })

    if (!attempt) {
      throw new NotFoundException('Attempt not found')
    }

    if (attempt.userId !== user.id) {
      throw new ForbiddenException('You do not have access to this attempt')
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('This attempt has already been submitted or has expired')
    }

    if (new Date() > new Date(attempt.expiresAt)) {
      attempt.status = AttemptStatus.EXPIRED
      await this.attemptRepository.save(attempt)
      throw new BadRequestException('This attempt has expired')
    }

    const answersById = new Map(attempt.answers.map((a) => [a.id, a]))

    for (const answerIdKey of Object.keys(dto.answers)) {
      const answerId = Number(answerIdKey)
      if (!answersById.has(answerId)) {
        throw new BadRequestException(`Answer ${answerId} does not belong to this attempt`)
      }
    }

    let score = 0

    for (const answer of attempt.answers) {
      const submittedValue = dto.answers[answer.id]

      if (submittedValue !== undefined) {
        if (submittedValue < 0 || submittedValue >= answer.options.length) {
          throw new BadRequestException(
            `selectedOptionIndex for answer ${answer.id} must be between 0 and ${answer.options.length - 1}`,
          )
        }
        answer.selectedOptionIndex = submittedValue
      } else {
        answer.selectedOptionIndex = null
      }

      answer.isCorrect = answer.selectedOptionIndex !== null && answer.selectedOptionIndex === answer.correctOptionIndex

      if (answer.isCorrect) {
        score++
      }
    }

    attempt.score = score
    attempt.status = AttemptStatus.SUBMITTED
    attempt.submittedAt = new Date()

    await this.answersService.save(attempt.answers)
    await this.attemptRepository.save(attempt)

    return {
      score: `${attempt.score}/${attempt.totalQuestions}`,
      answers: attempt.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        text: a.text,
        options: a.options,
        selectedOptionIndex: a.selectedOptionIndex,
        correctOptionIndex: a.correctOptionIndex,
        isCorrect: a.isCorrect,
      })),
    }
  }
}
