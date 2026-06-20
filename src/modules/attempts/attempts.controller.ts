import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { AttemptsService } from './attempts.service'
import { CreateAttemptDto } from './dto/create-attempt.dto'
import { User } from 'src/decorators/user.decorator'
import { AuthUser } from 'src/types/auth-user.types'
import { SubmitAttemptDto } from './dto/submit-attempt.dto'
import { Roles } from 'src/decorators/roles.decorator'

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  @Roles('user')
  create(@Body() createAttemptDto: CreateAttemptDto, @User() user: AuthUser) {
    return this.attemptsService.create(createAttemptDto, user)
  }

  @Post('submit')
  @Roles('user')
  submit(@Body() dto: SubmitAttemptDto, @User() user: AuthUser) {
    return this.attemptsService.submit(dto, user)
  }

  @Get()
  @Roles('user')
  findAll(@User() user: AuthUser, @Query('quizId') quizId?: number) {
    return this.attemptsService.findAll(user, quizId)
  }

  @Get(':id')
  @Roles('user')
  findOne(@Param('id') id: string, @User() user: AuthUser) {
    return this.attemptsService.findOne(+id, user)
  }
}
