import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService
} from "../services/products.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await getProductsService();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.status(200).json({
      message: "Producto eliminado correctamente."
    });
  } catch (error) {
    next(error);
  }
};
