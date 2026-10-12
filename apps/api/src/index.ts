import "dotenv/config";
import express from "express";
import cors from "cors";

import usageRouter from "./routes/usage.js";
import uploadRouter from "./routes/upload.js";
import documentsRouter from "./routes/documents.js";
import chatRouter from "./routes/chat.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/usage", usageRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/chat", chatRouter);

app.listen(port, () => {
  console.log(
    `API listening on port ${port} (${process.env.NODE_ENV ?? "development"})`,
  );
});
