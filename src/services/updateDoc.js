import { db } from "../firebase";

export const updateDoc = async (collection, docId, doc) => {
  const updatedDoc = await db.collection(collection).doc(docId).update(doc);
  return updatedDoc;
};
