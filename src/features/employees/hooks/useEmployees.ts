import { useEffect, useState } from 'react'
import { getEmployees } from '../api/employeeApi'
import type { Employee } from '../types/employee'

interface UseEmployeesResult {
  employees: Employee[]
  isLoading: boolean
  error: string | null
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

  useEffect(() => {
    const abortController = new AbortController()

    async function loadEmployees() {
      setIsLoading(true)
      setError(null)

      try {
        const loadedEmployees = await getEmployees(abortController.signal)

        if (!abortController.signal.aborted) {
          setEmployees(loadedEmployees)
        }
      } catch (loadError) {
        if (isAbortError(loadError) || abortController.signal.aborted) {
          return
        }

        setError(getErrorMessage(loadError))
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadEmployees()

    return () => {
      abortController.abort()
    }
  }, [])

  return {
    employees,
    isLoading,
    error,
  }
}
