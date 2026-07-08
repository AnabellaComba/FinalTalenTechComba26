import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config.js";
import { findUserByCredentialsModel } from "../models/user.model.js";
import { HttpError } from "../utils/HttpError.js";

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(400, "Email y password son obligatorios.");
  }

  const user = await findUserByCredentialsModel(email, password);

  if (!user) {
    throw new HttpError(401, "Credenciales invalidas.");
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn
    }
  );

  return {
    token,
    user: {
      email: user.email,
      name: user.name || user.email,
      role: user.role || "user"
    }
  };
};
