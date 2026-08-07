import { useRef, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { updateEmployeeSalary } from '../api/employeeApi'
import type { Employee, UpdateEmployeeSalaryInput } from '../types/employee'

interface UseUpdateEmployeeSalaryResult {
  submitSalaryUpdate: (
    employeeId: string,
    input: UpdateEmployeeSalaryInput,
  ) => Promise<Employee | null>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
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
  ): Promise<Employee | null> => {
    if (isSubmittingRef.current) {
      return null
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)

    try {
      return await updateEmployeeSalary(employeeId, input)
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setError(submitError.message)
        return null
      }

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
