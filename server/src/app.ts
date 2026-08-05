import express from "express";
import { employeeRouter } from "./features/employees/employee.routes.ts";

export const app = express();

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "Employee Management API is running.",
  });
});

app.use("/api/employees", employeeRouter);
