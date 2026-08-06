import { useEffect, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { getEmployeeById } from '../api/employeeApi'
import type { Employee } from '../types/employee'

interface UseEmployeeResult {
  employee: Employee | null
  isLoading: boolean
  error: string | null
  isNotFound: boolean
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to load employee details.'
}

function isEmployeeNotFoundError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 404 || error.code === 'EMPLOYEE_NOT_FOUND')
  )
}

export function useEmployee(
  employeeId: string | undefined,
): UseEmployeeResult {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(employeeId))
  const [error, setError] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [loadedEmployeeId, setLoadedEmployeeId] = useState<string | null>(null)

  useEffect(() => {
    if (!employeeId) {
      return
    }

    const abortController = new AbortController()

    getEmployeeById(employeeId, abortController.signal)
      .then((loadedEmployee) => {
        if (!abortController.signal.aborted) {
          setEmployee(loadedEmployee)
          setError(null)
          setIsNotFound(false)
          setLoadedEmployeeId(employeeId)
        }
      })
      .catch((loadError: unknown) => {
        if (isAbortError(loadError) || abortController.signal.aborted) {
          return
        }

        if (isEmployeeNotFoundError(loadError)) {
          setEmployee(null)
          setError(null)
          setIsNotFound(true)
          setLoadedEmployeeId(employeeId)
          return
        }

        setError(getErrorMessage(loadError))
        setIsNotFound(false)
        setLoadedEmployeeId(employeeId)
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [employeeId])

  if (!employeeId) {
    return {
      employee: null,
      isLoading: false,
      error: 'Employee id is missing.',
      isNotFound: false,
    }
  }

  const hasLoadedCurrentEmployee = loadedEmployeeId === employeeId

  return {
    employee: hasLoadedCurrentEmployee ? employee : null,
    isLoading: hasLoadedCurrentEmployee ? isLoading : true,
    error: hasLoadedCurrentEmployee ? error : null,
    isNotFound: hasLoadedCurrentEmployee ? isNotFound : false,
  }
}
