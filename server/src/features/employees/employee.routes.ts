import { Router } from "express";
import {
  createEmployee,
  findAllEmployees,
  findEmployeeById,
  updateEmployeeSalary,
} from "./employee.repository.ts";
import {
  createEmployeeSchema,
  updateEmployeeSalarySchema,
} from "./employee.schemas.ts";

export const employeeRouter = Router();

employeeRouter.get("/", (_request, response) => {
  const employees = findAllEmployees();

  response.status(200).json(employees);
});

employeeRouter.post("/", (request, response) => {
  const validationResult = createEmployeeSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The provided employee data is invalid.",
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  const employee = createEmployee(validationResult.data);

  response
    .status(201)
    .set("Location", `/api/employees/${employee.id}`)
    .json(employee);
});

employeeRouter.patch("/:id/salary", (request, response) => {
  const validationResult = updateEmployeeSalarySchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The provided salary is invalid.",
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  const employee = updateEmployeeSalary(
    request.params.id,
    validationResult.data,
  );

  if (!employee) {
    response.status(404).json({
      error: {
        code: "EMPLOYEE_NOT_FOUND",
        message: "Employee was not found.",
      },
    });

    return;
  }

  response.status(200).json(employee);
});

employeeRouter.get("/:id", (request, response) => {
  const employee = findEmployeeById(request.params.id);

  if (!employee) {
    response.status(404).json({
      error: {
        code: "EMPLOYEE_NOT_FOUND",
        message: "Employee was not found.",
      },
    });

    return;
  }

  response.status(200).json(employee);
});
