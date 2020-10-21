import React, { useEffect, useState } from "react";
import { Segment, Table } from "semantic-ui-react";
import { deleteDoc, getModelSessionsForModel, updateDoc } from "../../services";
import ModelSessionItem from "./ModelSessionItem";

const ModelSessionTable = ({ modelId, model }) => {
  const [loading, setLoading] = useState(true);
  const [modelSessions, setModelSessions] = useState([]);

  useEffect(() => {
    const getModelSessions = async () => {
      try {
        const modelSessions = await getModelSessionsForModel(modelId);
        setModelSessions(modelSessions.sort((a, b) => b.date - a.date));
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getModelSessions();
  }, [modelId]);

  let totalToPayment = 0;
  if (modelSessions.length)
    modelSessions.forEach((ms) => !ms.isPaid && (totalToPayment += ms.payment));

  const deleteModelSession = async (modelSessionId) => {
    if (window.confirm("למחוק את יום הצילום?")) {
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

  return (
    <Segment className="wrapped" loading={loading}>
      <h1 className="print">{model.name}</h1>
      <Table textAlign="center" id="my-table" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>שם ההפקה</Table.HeaderCell>
            <Table.HeaderCell>תאריך</Table.HeaderCell>
            <Table.HeaderCell>דרך הגעה</Table.HeaderCell>
            <Table.HeaderCell>תשלום</Table.HeaderCell>
            <Table.HeaderCell>שולם \ לא שולם</Table.HeaderCell>
            <Table.HeaderCell className="noprint">פעולות</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {modelSessions.map((modelSession) => {
            return (
              <ModelSessionItem
                key={modelSession.id}
                modelSession={modelSession}
                model={model}
                deleteModelSession={deleteModelSession}
                updateModelSession={updateModelSession}
              />
            );
          })}
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>סה"כ חובה:</Table.Cell>
            <Table.Cell>{totalToPayment} ש"ח</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default ModelSessionTable;
