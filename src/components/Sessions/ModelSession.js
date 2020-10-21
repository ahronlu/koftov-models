import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Image, Table } from "semantic-ui-react";
import { EditModelSession } from "../shared/EditModelSession";
import "./ModelSession.scss";
const ModelSession = ({
  modelSession,
  deleteModelSession,
  updateModelSession,
}) => {
  const [showModalForm, setShowModalForm] = useState(false);
  const { model } = modelSession;

  return (
    <>
      {model && (
        <Table.Row
          positive={!!modelSession.isPaid}
          negative={!modelSession.isPaid}
          className="ModelSession"
        >
          <Table.Cell>
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              style={{ textDecoraction: "none", color: "black" }}
            >
              <Image
                className="myImage model-session-image"
                src={model.image}
                alt={model.image}
              />
            </Link>
          </Table.Cell>
          <Table.Cell singleLine>
            <Link
              key={model.id}
              to={`/models/${model.id}`}
              style={{ textDecoraction: "none", color: "black" }}
            >
              {model.name}{" "}
            </Link>
          </Table.Cell>
          <Table.Cell>{model.gender === "male" ? "ז" : "נ"}</Table.Cell>
          <Table.Cell singleLine>{model.phone}</Table.Cell>
          <Table.Cell singleLine>{model.city}</Table.Cell>
          <Table.Cell singleLine>{model.birthYear}</Table.Cell>
          <Table.Cell singleLine>ס"מ {model.height}</Table.Cell>
          <Table.Cell singleLine>
            <p>חולצה: {model.shirtSize}</p>
            <p>מכנסיים: {model.pantsSize}</p>
            <p>נעליים: {model.shoeSize}</p>
          </Table.Cell>
          <Table.Cell singleLine>
            {modelSession.hasTransportation ? "הסעה" : "עצמאית"}
          </Table.Cell>
          <Table.Cell singleLine>{modelSession.payment}₪</Table.Cell>
          <Table.Cell singleLine>
            {modelSession.isPaid ? "שולם" : "לא שולם"}
          </Table.Cell>
          <Table.Cell className="noprint">
            <Icon
              onClick={() => setShowModalForm(true)}
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

export default ModelSession;
