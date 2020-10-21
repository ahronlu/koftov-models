import React from "react";
import { Link } from "react-router-dom";
import { Table, Icon } from "semantic-ui-react";

const Model = ({ model, deleteModel }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link
          key={model.id}
          to={`/models/${model.id}`}
          style={{ textDecoraction: "none", color: "black" }}
        >
          {model.name}
        </Link>
      </Table.Cell>
      <Table.Cell>{model.gender === "male" ? "ז" : "נ"}</Table.Cell>
      <Table.Cell>{model.phone}</Table.Cell>
      <Table.Cell>{model.city}</Table.Cell>
      <Table.Cell>{model.birthYear}</Table.Cell>
      <Table.Cell>
        <Link style={{ color: "green" }} to={`/models/${model.id}/edit`}>
          <Icon name="edit" />
        </Link>
        <Icon
          name="delete"
          link
          style={{ color: "red" }}
          onClick={() => deleteModel(model.id)}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default Model;
