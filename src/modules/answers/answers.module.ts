import { Module } from '@nestjs/common'
import { Answer } from './entities/answer.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnswersService } from './answers.service'

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  controllers: [],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
