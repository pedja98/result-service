import { Attempt } from 'src/modules/attempts/entities/attempt.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  questionId!: number

  @Column()
  text!: string

  @Column('jsonb')
  options!: string[]

  @Column({ nullable: true, type: 'int' })
  selectedOptionIndex!: number | null

  @Column()
  correctOptionIndex!: number

  @Column({ default: false })
  isCorrect!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne(() => Attempt, (attempt) => attempt.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: Attempt

  @Column()
  attemptId!: number
}
