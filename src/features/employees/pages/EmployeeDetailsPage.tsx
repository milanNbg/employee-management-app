import { useState } from 'react'
import { useParams } from 'react-router'
import { BackToEmployeesLink } from '../../../components/BackToEmployeesLink'
import { SalaryUpdateDialog } from '../components/SalaryUpdateDialog'
import { useUpdateEmployeeSalary } from '../hooks/useUpdateEmployeeSalary'
import {
  formatDate,
  formatEmployeeName,
  formatSalary,
  formatTime,
} from '../utils/employeeFormatters'
import { useEmployee } from '../hooks/useEmployee'
import type { UpdateEmployeeSalaryFormValues } from '../schemas/employeeSchema'

function renderDateTime(date: string) {
  return (
    <span className="employee-date-time">
      <span>{formatDate(date)}</span>
      <span>{formatTime(date)}</span>
    </span>
  )
}

export function EmployeeDetailsPage() {
  const { employeeId } = useParams()
  const {
    employee,
    isLoading,
    error,
    isNotFound,
    updateEmployee,
  } = useEmployee(employeeId)
  const [isSalaryDialogVisible, setIsSalaryDialogVisible] = useState(false)
  const {
    submitSalaryUpdate,
    isSubmitting: isSalarySubmitting,
    error: salaryUpdateError,
    clearError: clearSalaryUpdateError,
  } = useUpdateEmployeeSalary()

  const showSalaryUpdateDialog = () => {
    clearSalaryUpdateError()
    setIsSalaryDialogVisible(true)
  }

  const closeSalaryUpdateDialog = () => {
    if (isSalarySubmitting) {
      return
    }

    clearSalaryUpdateError()
    setIsSalaryDialogVisible(false)
  }

  const handleSalaryUpdate = async (
    values: UpdateEmployeeSalaryFormValues,
  ) => {
    if (!employee || isSalarySubmitting) {
      return
    }

    const updatedEmployee = await submitSalaryUpdate(employee.id, values)

    if (!updatedEmployee) {
      return
    }

    updateEmployee(updatedEmployee)
    closeSalaryUpdateDialog()
  }

  return (
    <main className="app">
      <div className="app-page-nav">
        <BackToEmployeesLink />
      </div>

      {isLoading && (
        <p className="app-state" role="status" aria-live="polite">
          Loading employee details...
        </p>
      )}

      {!isLoading && error && (
        <p className="app-state app-state-error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && isNotFound && (
        <section
          className="employee-details-card employee-not-found-card"
          aria-labelledby="employee-not-found-title"
        >
          <header className="employee-details-header">
            <p>Employee record</p>
            <h1 id="employee-not-found-title">Employee not found</h1>
          </header>
          <div className="employee-not-found-content">
            <p>
              We couldn't find an employee with this ID. The employee may
              have been removed or the link may be incorrect.
            </p>
          </div>
        </section>
      )}

      {!isLoading && !error && !isNotFound && employee && (
        <article className="employee-details-card">
          <header className="employee-details-header">
            <div>
              <p>Employee profile</p>
              <h1>{formatEmployeeName(employee)}</h1>
            </div>
            <button
              className="app-primary-button"
              type="button"
              disabled={isSalarySubmitting || isSalaryDialogVisible}
              onClick={showSalaryUpdateDialog}
            >
              Update salary
            </button>
          </header>

          <dl className="employee-details-list">
            <div>
              <dt>Salary</dt>
              <dd>{formatSalary(employee.salary)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{renderDateTime(employee.createdAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{renderDateTime(employee.updatedAt)}</dd>
            </div>
          </dl>

          {isSalaryDialogVisible && (
            <SalaryUpdateDialog
              currentSalary={employee.salary}
              onSubmit={handleSalaryUpdate}
              onClose={closeSalaryUpdateDialog}
              isSubmitting={isSalarySubmitting}
              submissionError={salaryUpdateError}
            />
          )}
        </article>
      )}
    </main>
  )
}
