import {
  createProductModel,
  deleteProductModel,
  findProductByIdModel,
  findProductsModel,
  updateProductModel
} from "../models/product.model.js";
import { HttpError } from "../utils/HttpError.js";
import { normalizarCategoria, validateProductPayload } from "../utils/validators.js";

export const getProductsService = async () => {
  return findProductsModel();
};

export const getProductByIdService = async (id) => {
  const product = await findProductByIdModel(id);

  if (!product) {
    throw new HttpError(404, "Producto no encontrado.");
  }

  return product;
};

export const createProductService = async (payload) => {
  validateProductPayload(payload);

  const product = {
    name: payload.name.trim(),
    category: normalizarCategoria(payload.category),
    price: payload.price,
    currency: payload.currency || "ARS",
    description: payload.description || "",
    imageUrl: payload.imageUrl || "",
    available: payload.available ?? true
  };

  return createProductModel(product);
};

export const updateProductService = async (id, payload) => {
  validateProductPayload(payload, { partial: true });

  const existingProduct = await findProductByIdModel(id);

  if (!existingProduct) {
    throw new HttpError(404, "Producto no encontrado.");
  }

  const productToUpdate = { ...payload };

  if (productToUpdate.category !== undefined) {
    productToUpdate.category = normalizarCategoria(productToUpdate.category);
  }

  return updateProductModel(id, productToUpdate);
};

export const deleteProductService = async (id) => {
  const existingProduct = await findProductByIdModel(id);

  if (!existingProduct) {
    throw new HttpError(404, "Producto no encontrado.");
  }

  await deleteProductModel(id);
};
