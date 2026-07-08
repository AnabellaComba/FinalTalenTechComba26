import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import { db } from "../config/firebase.config.js";
import { HttpError } from "../utils/HttpError.js";

const usersCollectionName = process.env.FIRESTORE_USERS_COLLECTION || "users";
const usersCollection = collection(db, usersCollectionName);

const mapUserDocument = (documentSnapshot) => ({
  id: documentSnapshot.id,
  ...documentSnapshot.data()
});

const handleFirestoreError = (error) => {
  console.error("Error de Firestore:", error);
  throw new HttpError(500, "No se pudo conectar con el servicio de usuarios.");
};

export const findUserByCredentialsModel = async (email, password) => {
  try {
    const usersQuery = query(
      usersCollection,
      where("email", "==", email),
      where("password", "==", password)
    );
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return null;
    }

    return mapUserDocument(snapshot.docs[0]);
  } catch (error) {
    handleFirestoreError(error);
  }
};

export const saveUserModel = async (id, user) => {
  try {
    const userRef = doc(db, usersCollectionName, id);
    await setDoc(userRef, user, { merge: true });
    return { id, ...user };
  } catch (error) {
    handleFirestoreError(error);
  }
};
