import { db } from "../firebase";

export const getDocs = async (collection, orderBy, query, showMore) => {
  const collectionRef = db.collection(collection);
  const querySnapshot = await collectionRef
    .orderBy(orderBy)
    .startAt(query)
    .endAt(query + "\uf8ff")
    .limit(1 * showMore)
    .get();

  const docs = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return docs;
};
