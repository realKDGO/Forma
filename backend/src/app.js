import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import { api } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errors.js";
export const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(","),
    credentials: false,
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(
  pinoHttp({
    redact: [
      "req.headers.authorization",
      "req.body.password",
      "req.body.token",
    ],
  }),
);
app.use(
  "/api/v1/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(
  "/api/v1",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
  api,
);
app.use(notFound);
app.use(errorHandler);
