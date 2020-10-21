import moment from "moment";
import React, { useEffect, useState } from "react";
import { Header, Message, Segment, Table } from "semantic-ui-react";
import {
  deleteDoc,
  getModelSessionsForSession,
  updateDoc,
} from "../../services";
import ModelSession from "./ModelSession";

const ModelSessions = ({ sessionId, session }) => {
  const [loading, setLoading] = useState(true);
  const [modelSessions, setModelSessions] = useState([]);

  useEffect(() => {
    const getModelSessions = async () => {
      try {
        const modelSessions = await getModelSessionsForSession(
          sessionId,
          "sessions"
        );
        setModelSessions(modelSessions.sort((a, b) => a.isPaid - b.isPaid));
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getModelSessions();
  }, [sessionId, session]);

  const updateModelSession = async (updatedModelSession) => {
    try {
      await updateDoc("modelSessions", updatedModelSession.id, {
        payment: updatedModelSession.payment,
        hasTransportation: updatedModelSession.hasTransportation,
        isPaid: updatedModelSession.isPaid,
      });
      const newModelSessions = modelSessions.map((modelSession) => {
        if (modelSession.id === updatedModelSession.id) {
          return updatedModelSession;
        } else {
          return modelSession;
        }
      });
      await setModelSessions(newModelSessions);
    } catch (err) {
      alert(err);
    }
  };

  const deleteModelSession = async (modelSessionId) => {
    if (window.confirm("למחוק את המיוצג מיום הצילום?")) {
      try {
        await deleteDoc("modelSessions", modelSessionId);
        setModelSessions(
          modelSessions.filter(
            (modelSession) => modelSession.id !== modelSessionId
          )
        );
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      <Segment style={{ overflowY: "scroll" }} loading={loading}>
        <Header className="noprint">
          <Message
            positive={!!modelSessions.length}
            negative={!!modelSessions.length === 0}
            content={`${modelSessions.length} משתתפים ביום צילום זה:`}
          />
        </Header>
        <h1 className="print">
          {session.production} {moment(session.date).format("DD/MM/YYYY")}
        </h1>
        <Table selectable unstackable textAlign="center" id="my_table">
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell singleLine>תמונה</Table.HeaderCell>
              <Table.HeaderCell singleLine>שם מלא</Table.HeaderCell>
              <Table.HeaderCell singleLine>מין</Table.HeaderCell>
              <Table.HeaderCell singleLine>טלפון</Table.HeaderCell>
              <Table.HeaderCell>עיר</Table.HeaderCell>
              <Table.HeaderCell singleLine>שנת לידה</Table.HeaderCell>
              <Table.HeaderCell>גובה</Table.HeaderCell>
              <Table.HeaderCell singleLine>מידות</Table.HeaderCell>
              <Table.HeaderCell singleLine>דרך הגעה</Table.HeaderCell>
              <Table.HeaderCell singleLine>תשלום</Table.HeaderCell>
              <Table.HeaderCell singleLine>סטטוס תשלום</Table.HeaderCell>
              <Table.HeaderCell className="noprint" singleLine>
                פעולות
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {modelSessions.map((modelSession, index) => {
              return (
                <ModelSession
                  key={index}
                  updateModelSession={updateModelSession}
                  deleteModelSession={deleteModelSession}
                  modelSession={modelSession}
                />
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default ModelSessions;
