import express from "express";
import cors from "cors";
import "dotenv/config";
import { corsConfig } from "./src/config/cors.config.js";
import authRoutes from "./src/routes/auth.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import { initialProducts } from "./src/data/initialProducts.js";
import { renderHome } from "./src/views/home.view.js";
import { notFoundHandler, errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();
const firebaseClientConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

app.use(cors(corsConfig));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Datos recibidos: ${req.method} ${req.url}`);
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).send(renderHome(initialProducts, firebaseClientConfig));
});

app.use("/auth", authRoutes);
app.use("/api/products", productsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
