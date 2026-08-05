import './App.css'
import { EmployeeTable } from './features/employees/components/EmployeeTable'
import { useEmployees } from './features/employees/hooks/useEmployees'

export function App() {
  const { employees, isLoading, error } = useEmployees()

  return (
    <main className="app">
      <section className="app-header" aria-labelledby="page-title">
        <h1 id="page-title">Employee Management</h1>
        <p>Manage employees and record screen walkthroughs.</p>
      </section>

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
