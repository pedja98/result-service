import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AttemptStatus } from '../enums/attempt-status.enum'
import { Answer } from 'src/modules/answers/entities/answer.entity'

@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  attemptNumber!: number

  @Column()
  userId!: string

  @Column()
  quizId!: number

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.IN_PROGRESS,
  })
  status!: AttemptStatus

  @Column({ default: 0 })
  score!: number

  @Column()
  totalQuestions!: number

  @CreateDateColumn()
  createdAt!: Date

  @Column()
  expiresAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  submittedAt!: Date | null

  @OneToMany(() => Answer, (answer) => answer.attempt)
  answers!: Answer[]
}
