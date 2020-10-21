import React, { useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Icon, Table } from "semantic-ui-react";
import { EditModelSession } from "../shared/EditModelSession";

const ModelSessionItem = ({
  modelSession,
  model,
  deleteModelSession,
  updateModelSession,
}) => {
  const [showModalForm, setShowModalForm] = useState(false);

  return (
    <>
      {modelSession && (
        <Table.Row
          positive={!!modelSession.isPaid}
          negative={!modelSession.isPaid}
        >
          <Table.Cell>
            <Link
              key={model.id}
              to={`/sessions/${modelSession.sessionId}`}
              style={{ textDecoraction: "none", color: "black" }}
            >
              {modelSession.session.production}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <Moment
              date={modelSession.session.date.toDate()}
              format="DD/MM/YYYY"
            />
          </Table.Cell>
          <Table.Cell>
            {modelSession.hasTransportation ? "הסעה" : "עצמאית"}
          </Table.Cell>
          <Table.Cell>{`${modelSession.payment} ש"ח`}</Table.Cell>
          <Table.Cell>{modelSession.isPaid ? "שולם" : "לא שולם"}</Table.Cell>
          <Table.Cell className="noprint">
            <Icon
              onClick={async () => {
                setShowModalForm(true);
              }}
              color="green"
              link
              name="edit"
              to="#"
            />
            <Icon
              color="red"
              link
              onClick={() => deleteModelSession(modelSession.id)}
              name="delete"
              to="#"
            />
          </Table.Cell>
          <EditModelSession
            model={model}
            showModalForm={showModalForm}
            setShowModalForm={setShowModalForm}
            updateModelSession={updateModelSession}
            doc={modelSession}
          />
        </Table.Row>
      )}
    </>
  );
};

export default ModelSessionItem;
