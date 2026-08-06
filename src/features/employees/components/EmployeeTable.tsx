import type { Employee } from '../types/employee'

interface EmployeeTableProps {
  employees: Employee[]
}

const salaryFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function formatEmployeeName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}

function formatSalary(salary: number): string {
  return salaryFormatter.format(salary)
}

function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

function formatTime(date: string): string {
  return timeFormatter.format(new Date(date))
}

function renderDateTime(date: string) {
  return (
    <span className="employee-date-time">
      <span>{formatDate(date)}</span>
      <span>{formatTime(date)}</span>
    </span>
  )
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <>
      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th scope="col">Employee</th>
              <th scope="col">Salary</th>
              <th scope="col">Created</th>
              <th scope="col">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <th scope="row">{formatEmployeeName(employee)}</th>
                <td>{formatSalary(employee.salary)}</td>
                <td>{renderDateTime(employee.createdAt)}</td>
                <td>{renderDateTime(employee.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="employee-card-list" aria-label="Employees">
        {employees.map((employee) => (
          <article className="employee-card" key={employee.id}>
            <h2>{formatEmployeeName(employee)}</h2>
            <dl>
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
          </article>
        ))}
      </div>
    </>
  )
}
