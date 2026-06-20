import { Type } from 'class-transformer'
import { ArrayMinSize, IsArray, IsInt, IsNumber, Min, ValidateNested } from 'class-validator'
import { CreateAttemptQuestionDto } from './create-attempt-question.dto'

export class CreateAttemptDto {
  @IsNumber()
  quizId!: number

  @IsInt()
  @Min(1)
  duration!: number

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAttemptQuestionDto)
  questions!: CreateAttemptQuestionDto[]
}
