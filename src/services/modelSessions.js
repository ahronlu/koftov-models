import { db } from "../firebase";
import { mapAsync, getDoc } from ".";

export const getModelSessionsForSession = async (sessionId) => {
  const querySnapshot = await db
    .collection("modelSessions")
    .where("sessionId", "==", sessionId)
    .get();

  const modelSessions = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const populateModelSessions = await mapAsync(
    modelSessions,
    async (modelSession) => {
      const model = await getDoc("models", modelSession.modelId);
      return {
        ...modelSession,
        model,
      };
    }
  );

  return populateModelSessions;
};

export const getModelSessionsForModel = async (modelId) => {
  const querySnapshot = await db
    .collection("modelSessions")
    .where("modelId", "==", modelId)
    .get();

  const modelSessions = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const populateModelSessions = await mapAsync(
    modelSessions,
    async (modelSession) => {
      const session = await getDoc("sessions", modelSession.sessionId);
      return {
        ...modelSession,
        session,
      };
    }
  );

  return populateModelSessions;
};
