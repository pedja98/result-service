import { ArrayMinSize, IsArray, IsInt, IsNumber, IsString, Min } from 'class-validator'

export class CreateAttemptQuestionDto {
  @IsNumber()
  questionId!: number

  @IsString()
  text!: string

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options!: string[]

  @IsInt()
  @Min(0)
  correctOptionIndex!: number
}
