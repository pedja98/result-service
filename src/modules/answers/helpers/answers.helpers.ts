import { Answer } from '../entities/answer.entity'
import { SafeAnswer } from '../types/safe-answer.types'

export const toSafeAnswer = (answer: Answer): SafeAnswer => {
  return {
    id: answer.id,
    questionId: answer.questionId,
    text: answer.text,
    options: answer.options,
    selectedOptionIndex: answer.selectedOptionIndex,
    createdAt: answer.createdAt,
    attemptId: answer.attemptId,
  }
}
