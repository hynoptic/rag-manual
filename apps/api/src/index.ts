import "dotenv/config";
import express from "express";
import cors from "cors";

import usageRouter from "./routes/usage.js";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: process.env.WEB_URL,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/usage", usageRouter);

console.log(
  `API listening on port ${port} (${process.env.NODE_ENV ?? "development"})`
);