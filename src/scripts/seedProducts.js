import "../config/env.config.js";
import { createProductModel } from "../models/product.model.js";
import { initialProducts } from "../data/initialProducts.js";

const seedProducts = async () => {
  try {
    const createdProducts = [];

    for (const product of initialProducts) {
      const createdProduct = await createProductModel(product);
      createdProducts.push(createdProduct);
    }

    console.log(`${createdProducts.length} productos cargados en Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error("No se pudieron cargar los productos iniciales:", error.message);
    process.exit(1);
  }
};

seedProducts();
