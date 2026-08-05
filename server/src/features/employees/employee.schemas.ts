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

export type EmployeeRow = z.infer<typeof employeeRowSchema>;
