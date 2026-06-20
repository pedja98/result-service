import { Answer } from 'src/modules/answers/entities/answer.entity'
import { Attempt } from '../entities/attempt.entity'
import { SafeAnswer } from 'src/modules/answers/types/safe-answer.types'

export interface AttemptResponse extends Omit<Attempt, 'answers'> {
  answers: (Answer | SafeAnswer)[]
}
