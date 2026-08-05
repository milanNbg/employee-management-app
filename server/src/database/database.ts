import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.cwd(), "data", "employee-management.db");

mkdirSync(dirname(databasePath), {
  recursive: true,
});

export const database = new DatabaseSync(databasePath);

export function initializeDatabase() {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      salary INTEGER NOT NULL CHECK (salary >= 0),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}
