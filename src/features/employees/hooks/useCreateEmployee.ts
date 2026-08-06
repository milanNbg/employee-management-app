import { useState } from 'react'
import { createEmployee } from '../api/employeeApi'
import type { Employee, CreateEmployeeInput } from '../types/employee'

interface UseCreateEmployeeResult {
  submitEmployee: (input: CreateEmployeeInput) => Promise<Employee>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to create employee.'
}

export function useCreateEmployee(): UseCreateEmployeeResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => {
    setError(null)
  }

  const submitEmployee = async (
    input: CreateEmployeeInput,
  ): Promise<Employee> => {
    setIsSubmitting(true)
    setError(null)

    try {
      return await createEmployee(input)
    } catch (submitError) {
      const message = getErrorMessage(submitError)
      setError(message)
      throw submitError
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitEmployee,
    isSubmitting,
    error,
    clearError,
  }
}
