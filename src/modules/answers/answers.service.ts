import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Answer } from './entities/answer.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  public async save(answers: Answer[]): Promise<Answer[]> {
    return await this.answerRepository.save(answers)
  }
}
