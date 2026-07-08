import "../config/env.config.js";
import { saveUserModel } from "../models/user.model.js";

const seedUsers = async () => {
  try {
    const adminUser = await saveUserModel("admin", {
      email: process.env.ADMIN_EMAIL || "admin@gmail.com",
      password: process.env.ADMIN_PASSWORD || "123456",
      name: "Administrador",
      role: "admin"
    });

    const regularUser = await saveUserModel("user", {
      email: process.env.USER_EMAIL || "user@gmail.com",
      password: process.env.USER_PASSWORD || "123456",
      name: "Usuario",
      role: "user"
    });

    console.log(`Usuario administrador cargado: ${adminUser.email}`);
    console.log(`Usuario lector cargado: ${regularUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error("No se pudo cargar el usuario administrador:", error.message);
    process.exit(1);
  }
};

seedUsers();
