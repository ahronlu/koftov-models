import { db } from "../firebase";
export const deleteDoc = async (collection, docId) => {
  await db.doc(`${collection}/${docId}`).delete();

  if (collection === "modelSessions") return;

  // if (collection === "models") {
  //   const storageRef = storage.ref();
  //   const fileRef = storageRef.child(docId + ".jpg");
  //   await fileRef
  //     .ref()
  //     .child(docId + ".jpg")
  //     .delete();
  // }

  let key = collection.slice(0, -1) + "Id";

  const snapshot = await db
    .collection("modelSessions")
    .where(key, "==", docId)
    .get();

  snapshot.docs.forEach(async (doc) => {
    await db.doc(`modelSessions/${doc.id}`).delete();
  });
};
