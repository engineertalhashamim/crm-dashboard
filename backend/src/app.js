import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { errorHandler } from "./midlewares/error.middleware.js";

import clientRouter from "./routes/client.routes.js";
import contactRouter from "./routes/contact.routes.js";
import contractRouter from "./routes/contract.routes.js";
import statusRouter from "./routes/status.routes.js";
import sourcesRouter from "./routes/source.routes.js";

app.use("/api/v1/client", clientRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/contract", contractRouter);
app.use("/api/v1/status", statusRouter);
app.use("/api/v1/source", sourcesRouter);

app.use(errorHandler);

export default app;
