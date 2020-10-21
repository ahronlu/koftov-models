import { db } from "../firebase";

export const addDoc = async (collection, doc) => {
  const docRef = await db.collection(collection).add(doc);
  return docRef;
};
