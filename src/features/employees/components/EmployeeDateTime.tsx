import { formatDate, formatTime } from '../utils/employeeFormatters'

interface EmployeeDateTimeProps {
  date: string
}

export function EmployeeDateTime({ date }: EmployeeDateTimeProps) {
  return (
    <span className="employee-date-time">
      <span>{formatDate(date)}</span>
      <span>{formatTime(date)}</span>
    </span>
  )
}
