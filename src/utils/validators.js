import { HttpError } from "./HttpError.js";

const categoriasValidas = ["cafeteria", "bebidas sin alcohol", "dulce", "salados"];

export const normalizarCategoria = (categoria) => categoria.trim().toLowerCase();

export const validateProductPayload = (payload, { partial = false } = {}) => {
  const errors = [];

  if (!partial || payload.name !== undefined) {
    if (!payload.name || typeof payload.name !== "string") {
      errors.push("El nombre del producto es obligatorio.");
    }
  }

  if (!partial || payload.category !== undefined) {
    if (!payload.category || typeof payload.category !== "string") {
      errors.push("La categoria del producto es obligatoria.");
    } else if (!categoriasValidas.includes(normalizarCategoria(payload.category))) {
      errors.push(`La categoria debe ser una de las siguientes: ${categoriasValidas.join(", ")}.`);
    }
  }

  if (!partial || payload.price !== undefined) {
    if (payload.price === undefined || typeof payload.price !== "number" || payload.price <= 0) {
      errors.push("El precio debe ser un numero mayor a 0.");
    }
  }

  if (payload.currency !== undefined && typeof payload.currency !== "string") {
    errors.push("La moneda debe ser texto.");
  }

  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.push("La descripcion debe ser texto.");
  }

  if (payload.imageUrl !== undefined && typeof payload.imageUrl !== "string") {
    errors.push("La URL de imagen debe ser texto.");
  }

  if (payload.available !== undefined && typeof payload.available !== "boolean") {
    errors.push("El campo available debe ser booleano.");
  }

  if (errors.length > 0) {
    throw new HttpError(400, errors.join(" "));
  }
};
