import { app } from "./app.ts";
import { initializeDatabase } from "./database/database.ts";
import { seedDatabase } from "./database/seed.ts";

const port = Number(process.env.PORT) || 3001;

initializeDatabase();
seedDatabase();

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
