import { randomUUID } from "node:crypto";
import { database } from "../../database/database.ts";
import {
  employeeRowSchema,
  employeeRowsSchema,
  type CreateEmployeeInput,
  type EmployeeRow,
} from "./employee.schemas.ts";
import type { Employee } from "./employee.types.ts";

function mapEmployeeRow(row: EmployeeRow): Employee {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    salary: row.salary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function findAllEmployees(): Employee[] {
  const statement = database.prepare(`
    SELECT
      id,
      first_name,
      last_name,
      salary,
      created_at,
      updated_at
    FROM employees
    ORDER BY created_at DESC
  `);

  const rows = employeeRowsSchema.parse(statement.all());

  return rows.map(mapEmployeeRow);
}

export function findEmployeeById(id: string): Employee | null {
  const statement = database.prepare(`
    SELECT
      id,
      first_name,
      last_name,
      salary,
      created_at,
      updated_at
    FROM employees
    WHERE id = ?
  `);

  const row = statement.get(id);

  if (!row) {
    return null;
  }

  return mapEmployeeRow(employeeRowSchema.parse(row));
}

export function createEmployee(input: CreateEmployeeInput): Employee {
  const id = randomUUID();
  const timestamp = new Date().toISOString();

  const statement = database.prepare(`
    INSERT INTO employees (
      id,
      first_name,
      last_name,
      salary,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    id,
    input.firstName,
    input.lastName,
    input.salary,
    timestamp,
    timestamp,
  );

  return {
    id,
    firstName: input.firstName,
    lastName: input.lastName,
    salary: input.salary,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
