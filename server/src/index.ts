import { app } from "./app.ts";

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
