import { apiRequest } from '../../../lib/apiClient'
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeSalaryInput,
} from '../types/employee'

const employeesApiPath = '/api/employees'

export function getEmployees(signal?: AbortSignal): Promise<Employee[]> {
  return apiRequest<Employee[]>(employeesApiPath, {
    signal,
  })
}

export function getEmployeeById(
  employeeId: string,
  signal?: AbortSignal,
): Promise<Employee> {
  return apiRequest<Employee>(`${employeesApiPath}/${employeeId}`, {
    signal,
  })
}

export function createEmployee(
  input: CreateEmployeeInput,
): Promise<Employee> {
  return apiRequest<Employee>(employeesApiPath, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateEmployeeSalary(
  employeeId: string,
  input: UpdateEmployeeSalaryInput,
): Promise<Employee> {
  return apiRequest<Employee>(`${employeesApiPath}/${employeeId}/salary`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
