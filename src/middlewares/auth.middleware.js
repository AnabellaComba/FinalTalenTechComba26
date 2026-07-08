import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config.js";
import { HttpError } from "../utils/HttpError.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new HttpError(401, "Token no enviado. Debe usar Authorization: Bearer token."));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new HttpError(401, "Formato de token invalido. Debe usar Bearer token."));
  }

  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    return next();
  } catch (error) {
    return next(new HttpError(403, "Token invalido o expirado."));
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new HttpError(403, "No tiene permisos de administrador."));
  }

  return next();
};
