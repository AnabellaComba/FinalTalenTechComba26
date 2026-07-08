import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../config/firebase.config.js";
import { HttpError } from "../utils/HttpError.js";

const productsCollectionName = process.env.FIRESTORE_PRODUCTS_COLLECTION || "products";
const productsCollection = collection(db, productsCollectionName);

const mapProductDocument = (documentSnapshot) => ({
  id: documentSnapshot.id,
  ...documentSnapshot.data()
});

const handleFirestoreError = (error) => {
  console.error("Error de Firestore:", error);
  throw new HttpError(500, "No se pudo conectar con el servicio de datos.");
};

export const findProductsModel = async () => {
  try {
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs
      .map(mapProductDocument)
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        return categoryCompare || a.name.localeCompare(b.name);
      });
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const findProductByIdModel = async (id) => {
  try {
    const productRef = doc(db, productsCollectionName, id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return mapProductDocument(snapshot);
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const createProductModel = async (product) => {
  try {
    const productToCreate = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(productsCollection, productToCreate);

    return {
      id: docRef.id,
      ...product
    };
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const updateProductModel = async (id, product) => {
  try {
    const productRef = doc(db, productsCollectionName, id);
    const productToUpdate = {
      ...product,
      updatedAt: serverTimestamp()
    };

    await updateDoc(productRef, productToUpdate);

    return findProductByIdModel(id);
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const deleteProductModel = async (id) => {
  try {
    const productRef = doc(db, productsCollectionName, id);
    await deleteDoc(productRef);
  } catch (error) {
    handleFirestoreError(error);
  }
};
