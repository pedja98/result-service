import { IsInt, IsNotEmpty } from 'class-validator'
import { IsAnswersMap } from '../validators/is-answer-map.validator'

export class SubmitAttemptDto {
  @IsNotEmpty()
  @IsInt()
  attemptId!: number

  @IsAnswersMap()
  answers!: Record<number, number>
}
