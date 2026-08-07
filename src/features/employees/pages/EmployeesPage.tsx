import { useState } from 'react'
import { Link } from 'react-router'
import { Toast } from '../../../components/Toast'
import { EmployeeFormDialog } from '../components/EmployeeFormDialog'
import { EmployeeList } from '../components/EmployeeList'
import { useCreateEmployee } from '../hooks/useCreateEmployee'
import { useEmployees } from '../hooks/useEmployees'
import type { CreateEmployeeFormValues } from '../schemas/employeeSchema'

interface SuccessToast {
  id: number
  message: string
}

export function EmployeesPage() {
  const [isEmployeeFormVisible, setIsEmployeeFormVisible] = useState(false)
  const [successToast, setSuccessToast] = useState<SuccessToast | null>(null)
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

    const createdEmployee = await submitEmployee(values)

    if (!createdEmployee) {
      return
    }

    await refreshEmployees()
    closeEmployeeForm()
    setSuccessToast({
      id: Date.now(),
      message: 'Employee added successfully.',
    })
  }

  return (
    <main className="app">
      <section className="app-header" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Employee Management</h1>
          <p>Manage employees and record screen walkthroughs.</p>
        </div>
        <div className="app-header-actions">
          <Link className="app-secondary-link-button" to="/recording">
            Screen recorder
          </Link>
          <button
            className="app-add-button"
            type="button"
            disabled={isSubmitting || isEmployeeFormVisible}
            onClick={showEmployeeForm}
          >
            Add employee
          </button>
        </div>
      </section>

      {isEmployeeFormVisible && (
        <EmployeeFormDialog
          onSubmit={handleCreateEmployee}
          onClose={closeEmployeeForm}
          isSubmitting={isSubmitting}
          submissionError={createEmployeeError}
        />
      )}

      {successToast && (
        <Toast
          key={successToast.id}
          message={successToast.message}
          onClose={() => {
            setSuccessToast(null)
          }}
        />
      )}

      {isLoading && (
        <p className="app-state" role="status" aria-live="polite">
          Loading employees...
        </p>
      )}

      {!isLoading && error && (
        <section
          className="app-state app-state-error app-load-error"
          role="alert"
          aria-labelledby="employee-load-error-title"
        >
          <div>
            <h2 id="employee-load-error-title">Unable to load employees</h2>
            <p>{error}</p>
          </div>
          <button
            className="app-secondary-button"
            type="button"
            onClick={() => {
              void refreshEmployees()
            }}
          >
            Retry
          </button>
        </section>
      )}

      {!isLoading && !error && employees.length === 0 && (
        <p className="app-state">No employees have been added yet.</p>
      )}

      {!isLoading && !error && employees.length > 0 && (
        <EmployeeList employees={employees} />
      )}
    </main>
  )
}
