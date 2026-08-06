import type { Employee } from '../types/employee'

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

export function formatEmployeeName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}

export function formatSalary(salary: number): string {
  return salaryFormatter.format(salary)
}

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

export function formatTime(date: string): string {
  return timeFormatter.format(new Date(date))
}
