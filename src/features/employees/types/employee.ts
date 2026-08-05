export interface Employee {
  id: string
  firstName: string
  lastName: string
  salary: number
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeInput {
  firstName: string
  lastName: string
  salary: number
}

export interface UpdateEmployeeSalaryInput {
  salary: number
}
