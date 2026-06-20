export interface SafeAnswer {
  id: number
  questionId: number
  text: string
  options: string[]
  selectedOptionIndex: number | null
  createdAt: Date
  attemptId: number
}
