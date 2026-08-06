import { Link } from 'react-router'
import {
  formatDate,
  formatEmployeeName,
  formatSalary,
  formatTime,
} from '../utils/employeeFormatters'
import type { Employee } from '../types/employee'

interface EmployeeTableProps {
  employees: Employee[]
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
                <th scope="row">
                  <Link
                    className="employee-name-link"
                    to={`/employees/${employee.id}`}
                  >
                    {formatEmployeeName(employee)}
                  </Link>
                </th>
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
            <h2>
              <Link
                className="employee-name-link"
                to={`/employees/${employee.id}`}
              >
                {formatEmployeeName(employee)}
              </Link>
            </h2>
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
