import { randomUUID } from "node:crypto";
import { z } from "zod";
import { database } from "./database.ts";

interface SeedEmployee {
  firstName: string;
  lastName: string;
  salary: number;
}

const employeeCountRowSchema = z.object({
  count: z.number().int().nonnegative(),
});

const seedEmployees: SeedEmployee[] = [
  {
    firstName: "Olivia",
    lastName: "Bennett",
    salary: 5200,
  },
  {
    firstName: "Ethan",
    lastName: "Carter",
    salary: 4800,
  },
  {
    firstName: "Sophia",
    lastName: "Morgan",
    salary: 6100,
  },
];

export function seedDatabase() {
  const countStatement = database.prepare(`
    SELECT COUNT(*) AS count
    FROM employees
  `);

  const result = employeeCountRowSchema.parse(countStatement.get());

  if (result.count > 0) {
    return;
  }

  const insertStatement = database.prepare(`
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

  const timestamp = new Date().toISOString();

  database.exec("BEGIN TRANSACTION");

  try {
    for (const employee of seedEmployees) {
      insertStatement.run(
        randomUUID(),
        employee.firstName,
        employee.lastName,
        employee.salary,
        timestamp,
        timestamp,
      );
    }

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
