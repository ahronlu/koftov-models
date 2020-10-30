import { db } from "../firebase";
const currentYear = new Date().getFullYear();

export const getCollection = async (collection, minAge, maxAge, showMore) => {
  const querySnapshot = await db
    .collection(collection)
    .where("birthYear", "<=", currentYear - minAge)
    .where("birthYear", ">=", currentYear - maxAge)
    .limit(1 * showMore)
    .get();

  const docs = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return docs;
};
