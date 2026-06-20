import { IsInt, IsNotEmpty, IsObject } from 'class-validator'
import { IsAnswersMap } from '../validators/is-answer-map.validator'
import { ApiProperty } from '@nestjs/swagger'

export class SubmitAttemptDto {
  @IsNotEmpty()
  @IsInt()
  attemptId!: number

  @ApiProperty({
    type: 'object',
    description: 'A key-value map where the key is the answer id and the value is the chosen correct option for that multiple-choice question.',
    additionalProperties: {
      type: 'integer',
    },
    example: {
      1: 2,
      2: 0,
    },
  })
  @IsAnswersMap()
  @IsObject()
  answers!: Record<number, number>
}
