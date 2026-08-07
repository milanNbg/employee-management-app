import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router'
import { EmployeeDateTime } from './EmployeeDateTime'
import {
  defaultEmployeeSort,
  employeeSortOptions,
  getInitialEmployeeSortDirection,
  getNextEmployeeSort,
  isEmployeeSortField,
  sortEmployees,
  type EmployeeSortDirection,
  type EmployeeSortField,
} from '../utils/employeeSorting'
import {
  formatEmployeeName,
  formatSalary,
} from '../utils/employeeFormatters'
import type { Employee } from '../types/employee'

interface EmployeeListProps {
  employees: Employee[]
}

interface SortIconProps {
  direction: EmployeeSortDirection | null
}

function getSortDirection(
  sortField: EmployeeSortField,
  sortDirection: EmployeeSortDirection,
  field: EmployeeSortField,
): EmployeeSortDirection | null {
  if (sortField !== field) {
    return null
  }

  return sortDirection
}

function getSortButtonLabel(
  sortField: EmployeeSortField,
  sortDirection: EmployeeSortDirection,
  field: EmployeeSortField,
  label: string,
): string {
  if (sortField !== field) {
    return `Sort by ${label}`
  }

  return sortDirection === 'ascending'
    ? `Sort ${label} descending`
    : `Sort ${label} ascending`
}

function SortIcon({ direction }: SortIconProps) {
  if (direction === 'ascending') {
    return (
      <svg
        className="employee-sort-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 3.5 3.8 8l1.1 1.1L7.2 6.7v5.8h1.6V6.7l2.3 2.4L12.2 8 8 3.5Z" />
      </svg>
    )
  }

  if (direction === 'descending') {
    return (
      <svg
        className="employee-sort-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 12.5 3.8 8l1.1-1.1 2.3 2.4V3.5h1.6v5.8l2.3-2.4L12.2 8 8 12.5Z" />
      </svg>
    )
  }

  return (
    <svg
      className="employee-sort-icon employee-sort-icon-inactive"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.5 5.1 6.4l1 1L8 5.5l1.9 1.9 1-1L8 3.5Zm0 9L5.1 9.6l1-1L8 10.5l1.9-1.9 1 1L8 12.5Z" />
    </svg>
  )
}

export function EmployeeList({ employees }: EmployeeListProps) {
  const [sort, setSort] = useState(defaultEmployeeSort)
  const sortedEmployees = useMemo(
    () => sortEmployees(employees, sort),
    [employees, sort],
  )

  const handleSortButtonClick = (field: EmployeeSortField) => {
    setSort((currentSort) => getNextEmployeeSort(currentSort, field))
  }

  const handleMobileSortFieldChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = event.target

    if (!isEmployeeSortField(value)) {
      return
    }

    setSort((currentSort) =>
      currentSort.field === value
        ? currentSort
        : {
            field: value,
            direction: getInitialEmployeeSortDirection(value),
          },
    )
  }

  const toggleSortDirection = () => {
    setSort((currentSort) => ({
      ...currentSort,
      direction:
        currentSort.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }

  return (
    <>
      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              {employeeSortOptions.map((option) => (
                <th
                  key={option.field}
                  scope="col"
                  aria-sort={
                    sort.field === option.field ? sort.direction : undefined
                  }
                >
                  <button
                    className="employee-sort-button"
                    type="button"
                    aria-label={getSortButtonLabel(
                      sort.field,
                      sort.direction,
                      option.field,
                      option.label,
                    )}
                    onClick={() => {
                      handleSortButtonClick(option.field)
                    }}
                  >
                    <span>{option.label}</span>
                    <span
                      className="employee-sort-indicator"
                      aria-hidden="true"
                    >
                      <SortIcon
                        direction={getSortDirection(
                          sort.field,
                          sort.direction,
                          option.field,
                        )}
                      />
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => (
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
                <td>
                  <EmployeeDateTime date={employee.createdAt} />
                </td>
                <td>
                  <EmployeeDateTime date={employee.updatedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="employee-mobile-sort">
        <label
          className="employee-mobile-sort-label"
          htmlFor="employee-mobile-sort-field"
        >
          Sort employees
        </label>
        <div className="employee-mobile-sort-controls">
          <div className="employee-mobile-select-wrapper">
            <select
              id="employee-mobile-sort-field"
              value={sort.field}
              onChange={handleMobileSortFieldChange}
            >
              {employeeSortOptions.map((option) => (
                <option key={option.field} value={option.field}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              className="employee-mobile-select-chevron"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 6.2 8 10l4-3.8-1-1.1-3 2.8-3-2.8-1 1.1Z" />
            </svg>
          </div>
          <button
            className="employee-mobile-sort-direction"
            type="button"
            aria-label={
              sort.direction === 'ascending'
                ? 'Sort descending'
                : 'Sort ascending'
            }
            onClick={toggleSortDirection}
          >
            <SortIcon direction={sort.direction} />
          </button>
        </div>
      </div>

      <div className="employee-card-list" aria-label="Employees">
        {sortedEmployees.map((employee) => (
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
                <dd>
                  <EmployeeDateTime date={employee.createdAt} />
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>
                  <EmployeeDateTime date={employee.updatedAt} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
