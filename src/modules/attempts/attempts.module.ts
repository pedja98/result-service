import { Module } from '@nestjs/common'
import { AttemptsService } from './attempts.service'
import { AttemptsController } from './attempts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attempt } from './entities/attempt.entity'
import { AnswersModule } from '../answers/answers.module'

@Module({
  imports: [TypeOrmModule.forFeature([Attempt]), AnswersModule],
  controllers: [AttemptsController],
  providers: [AttemptsService],
})
export class AttemptsModule {}
