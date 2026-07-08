import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/products.controller.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateToken, getProducts);
router.get("/:id", authenticateToken, getProductById);
router.post("/", authenticateToken, authorizeAdmin, createProduct);
router.put("/:id", authenticateToken, authorizeAdmin, updateProduct);
router.patch("/:id", authenticateToken, authorizeAdmin, updateProduct);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteProduct);

export default router;
