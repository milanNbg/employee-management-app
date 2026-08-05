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

function formatEmployeeName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}

function formatSalary(salary: number): string {
  return salaryFormatter.format(salary)
}

function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
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
              <td>{formatDate(employee.createdAt)}</td>
              <td>{formatDate(employee.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
