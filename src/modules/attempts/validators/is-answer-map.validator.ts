import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsAnswersMap(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAnswersMap',
      target: object.constructor,
      propertyName,
      options: {
        message: 'answers must be a map of answerId -> non-negative integer selectedOptionIndex',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
          const entries = Object.entries(value as Record<string, unknown>)
          if (entries.length === 0) return false
          return entries.every(([key, val]) => {
            const keyIsNumeric = !Number.isNaN(Number(key))
            const valIsNonNegativeInt = typeof val === 'number' && Number.isInteger(val) && val >= 0
            return keyIsNumeric && valIsNonNegativeInt
          })
        },
      },
    })
  }
}
