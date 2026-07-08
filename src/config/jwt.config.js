import "./env.config.js";

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "talentech_default_secret",
  expiresIn: process.env.JWT_EXPIRES_IN || "1h"
};
