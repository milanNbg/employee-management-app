import { useRef, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { createEmployee } from '../api/employeeApi'
import type { Employee, CreateEmployeeInput } from '../types/employee'

interface UseCreateEmployeeResult {
  submitEmployee: (input: CreateEmployeeInput) => Promise<Employee | null>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
}

export function useCreateEmployee(): UseCreateEmployeeResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

  const clearError = () => {
    setError(null)
  }

  const submitEmployee = async (
    input: CreateEmployeeInput,
  ): Promise<Employee | null> => {
    if (isSubmittingRef.current) {
      return null
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)

    try {
      return await createEmployee(input)
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
    submitEmployee,
    isSubmitting,
    error,
    clearError,
  }
}
