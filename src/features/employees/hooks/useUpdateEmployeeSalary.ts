import { useRef, useState } from 'react'
import { updateEmployeeSalary } from '../api/employeeApi'
import type { Employee, UpdateEmployeeSalaryInput } from '../types/employee'

interface UseUpdateEmployeeSalaryResult {
  submitSalaryUpdate: (
    employeeId: string,
    input: UpdateEmployeeSalaryInput,
  ) => Promise<Employee>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to update salary.'
}

export function useUpdateEmployeeSalary(): UseUpdateEmployeeSalaryResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

  const clearError = () => {
    setError(null)
  }

  const submitSalaryUpdate = async (
    employeeId: string,
    input: UpdateEmployeeSalaryInput,
  ): Promise<Employee> => {
    if (isSubmittingRef.current) {
      throw new Error('Salary update is already in progress.')
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)

    try {
      return await updateEmployeeSalary(employeeId, input)
    } catch (submitError) {
      const message = getErrorMessage(submitError)
      setError(message)
      throw submitError
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return {
    submitSalaryUpdate,
    isSubmitting,
    error,
    clearError,
  }
}
