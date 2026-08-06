import { useState } from 'react'
import { EmployeeFormDialog } from '../components/EmployeeFormDialog'
import { EmployeeTable } from '../components/EmployeeTable'
import { useCreateEmployee } from '../hooks/useCreateEmployee'
import { useEmployees } from '../hooks/useEmployees'
import type { CreateEmployeeFormValues } from '../schemas/employeeSchema'

export function EmployeesPage() {
  const [isEmployeeFormVisible, setIsEmployeeFormVisible] = useState(false)
  const { employees, isLoading, error, refreshEmployees } = useEmployees()
  const {
    submitEmployee,
    isSubmitting,
    error: createEmployeeError,
    clearError,
  } = useCreateEmployee()

  const showEmployeeForm = () => {
    clearError()
    setIsEmployeeFormVisible(true)
  }

  const closeEmployeeForm = () => {
    if (isSubmitting) {
      return
    }

    clearError()
    setIsEmployeeFormVisible(false)
  }

  const handleCreateEmployee = async (
    values: CreateEmployeeFormValues,
  ) => {
    if (isSubmitting) {
      return
    }

    await submitEmployee(values)
    await refreshEmployees()
    closeEmployeeForm()
  }

  return (
    <main className="app">
      <section className="app-header" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Employee Management</h1>
          <p>Manage employees and record screen walkthroughs.</p>
        </div>
        <button
          className="app-add-button"
          type="button"
          disabled={isSubmitting || isEmployeeFormVisible}
          onClick={showEmployeeForm}
        >
          Add employee
        </button>
      </section>

      {isEmployeeFormVisible && (
        <EmployeeFormDialog
          onSubmit={handleCreateEmployee}
          onClose={closeEmployeeForm}
          isSubmitting={isSubmitting}
          submissionError={createEmployeeError}
        />
      )}

      {isLoading && (
        <p className="app-state" role="status" aria-live="polite">
          Loading employees...
        </p>
      )}

      {!isLoading && error && (
        <p className="app-state app-state-error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && employees.length === 0 && (
        <p className="app-state">No employees have been added yet.</p>
      )}

      {!isLoading && !error && employees.length > 0 && (
        <EmployeeTable employees={employees} />
      )}
    </main>
  )
}
