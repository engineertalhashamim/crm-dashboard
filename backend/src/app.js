import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { pgPool } from "./db/index.js";
import pgSession from "connect-pg-simple";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const PgSession = new pgSession(session);

app.use(session({
  // name: "crm.sid",
  store: new PgSession({
    pool:pgPool,
    tableName: "user_sessions",
  }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, //1Day
  },
}));

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
import userRouter from "./routes/user.routes.js";
import leadRouter from "./routes/lead.routes.js";

app.use("/api/v1/client", clientRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/contract", contractRouter);
app.use("/api/v1/status", statusRouter);
app.use("/api/v1/source", sourcesRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/lead", leadRouter);

app.use(errorHandler);

export default app;
