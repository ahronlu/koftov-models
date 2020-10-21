import { db } from "../firebase";

export const getDoc = async (collection, docId) => {
  const docSnapshot = await db.doc(`${collection}/${docId}`).get();
  const doc = docSnapshot.data();
  return { ...doc, id: docId };
};
