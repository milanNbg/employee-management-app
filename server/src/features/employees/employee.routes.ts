import { Router } from "express";
import { findAllEmployees, findEmployeeById } from "./employee.repository.ts";

export const employeeRouter = Router();

employeeRouter.get("/", (_request, response) => {
  const employees = findAllEmployees();

  response.status(200).json(employees);
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
