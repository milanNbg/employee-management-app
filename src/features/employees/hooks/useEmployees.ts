import { useCallback, useEffect, useState } from 'react'
import { getEmployees } from '../api/employeeApi'
import type { Employee } from '../types/employee'

interface UseEmployeesResult {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  refreshEmployees: () => Promise<void>
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to load employees.'
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshEmployees = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const loadedEmployees = await getEmployees()
      setEmployees(loadedEmployees)
    } catch (loadError) {
      if (isAbortError(loadError)) {
        return
      }

      setError(getErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()

    getEmployees(abortController.signal)
      .then((loadedEmployees) => {
        if (!abortController.signal.aborted) {
          setEmployees(loadedEmployees)
        }
      })
      .catch((loadError: unknown) => {
        if (isAbortError(loadError) || abortController.signal.aborted) {
          return
        }

        setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [])

  return {
    employees,
    isLoading,
    error,
    refreshEmployees,
  }
}
