import { HttpError } from "../utils/HttpError.js";

const parseOrigins = (origins = "") =>
  origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultPort = process.env.PORT || 3000;
const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const defaultAllowedOrigins = [
  `http://localhost:${defaultPort}`,
  `http://127.0.0.1:${defaultPort}`,
  vercelOrigin
].filter(Boolean);

const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS);
const allowsAllOrigins = allowedOrigins.includes("*");
const allowedOriginsSet = new Set(
  allowedOrigins.length ? allowedOrigins : defaultAllowedOrigins
);

export const corsConfig = {
  origin: allowsAllOrigins
    ? "*"
    : (origin, callback) => {
        if (!origin || allowedOriginsSet.has(origin)) {
          return callback(null, true);
        }

        return callback(new HttpError(403, "Origen no permitido por CORS."));
      },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};
