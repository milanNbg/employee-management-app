import { z } from "zod";

export const employeeRowSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  salary: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const employeeRowsSchema = z.array(employeeRowSchema);

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters.")
    .max(50, "First name must contain at most 50 characters."),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters.")
    .max(50, "Last name must contain at most 50 characters."),
  salary: z
    .number()
    .int("Salary must be a whole number.")
    .nonnegative("Salary cannot be negative.")
    .max(10_000_000, "Salary exceeds the allowed maximum."),
});

export const updateEmployeeSalarySchema = z.object({
  salary: z
    .number()
    .int("Salary must be a whole number.")
    .nonnegative("Salary cannot be negative.")
    .max(10_000_000, "Salary exceeds the allowed maximum."),
});

export type EmployeeRow = z.infer<typeof employeeRowSchema>;

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeSalaryInput = z.infer<
  typeof updateEmployeeSalarySchema
>;
