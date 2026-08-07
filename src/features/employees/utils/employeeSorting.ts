import { formatEmployeeName } from './employeeFormatters'
import type { Employee } from '../types/employee'

export const employeeSortOptions = [
  {
    field: 'name',
    label: 'Employee',
  },
  {
    field: 'salary',
    label: 'Salary',
  },
  {
    field: 'createdAt',
    label: 'Created',
  },
  {
    field: 'updatedAt',
    label: 'Last updated',
  },
] as const

export type EmployeeSortField = (typeof employeeSortOptions)[number]['field']

export type EmployeeSortDirection = 'ascending' | 'descending'

export interface EmployeeSort {
  field: EmployeeSortField
  direction: EmployeeSortDirection
}

export const defaultEmployeeSort: EmployeeSort = {
  field: 'createdAt',
  direction: 'descending',
}

const employeeNameCollator = new Intl.Collator('en-US', {
  sensitivity: 'base',
})

export function getInitialEmployeeSortDirection(
  field: EmployeeSortField,
): EmployeeSortDirection {
  return field === 'name' || field === 'salary'
    ? 'ascending'
    : 'descending'
}

export function isEmployeeSortField(
  value: string,
): value is EmployeeSortField {
  return employeeSortOptions.some((option) => option.field === value)
}

export function getNextEmployeeSort(
  currentSort: EmployeeSort,
  field: EmployeeSortField,
): EmployeeSort {
  if (currentSort.field !== field) {
    return {
      field,
      direction: getInitialEmployeeSortDirection(field),
    }
  }

  return {
    field,
    direction:
      currentSort.direction === 'ascending' ? 'descending' : 'ascending',
  }
}

function compareEmployeesByField(
  firstEmployee: Employee,
  secondEmployee: Employee,
  field: EmployeeSortField,
): number {
  switch (field) {
    case 'name':
      return employeeNameCollator.compare(
        formatEmployeeName(firstEmployee),
        formatEmployeeName(secondEmployee),
      )
    case 'salary':
      return firstEmployee.salary - secondEmployee.salary
    case 'createdAt':
      return (
        Date.parse(firstEmployee.createdAt) -
        Date.parse(secondEmployee.createdAt)
      )
    case 'updatedAt':
      return (
        Date.parse(firstEmployee.updatedAt) -
        Date.parse(secondEmployee.updatedAt)
      )
  }
}

export function sortEmployees(
  employees: Employee[],
  sort: EmployeeSort,
): Employee[] {
  const directionMultiplier = sort.direction === 'ascending' ? 1 : -1

  return [...employees].sort((firstEmployee, secondEmployee) => {
    const result = compareEmployeesByField(
      firstEmployee,
      secondEmployee,
      sort.field,
    )

    return result * directionMultiplier
  })
}
