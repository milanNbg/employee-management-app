import { z } from 'zod'

const salarySchema = z.preprocess(
  (value) => {
    if (value === '') {
      return undefined
    }

    if (typeof value === 'string') {
      return Number(value)
    }

    return value
  },
  z
    .number('Salary is required.')
    .int('Salary must be a whole number.')
    .nonnegative('Salary cannot be negative.')
    .max(10_000_000, 'Salary exceeds the allowed maximum.'),
)

export const createEmployeeFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters.')
    .max(50, 'First name must contain at most 50 characters.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must contain at least 2 characters.')
    .max(50, 'Last name must contain at most 50 characters.'),
  salary: salarySchema,
})

export type CreateEmployeeFormValues = z.infer<
  typeof createEmployeeFormSchema
>
