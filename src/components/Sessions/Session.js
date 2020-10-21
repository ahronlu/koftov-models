import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Icon, Table } from "semantic-ui-react";

const Session = ({ session, deleteSession }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link
          key={session.id}
          to={`/sessions/${session.id}`}
          style={{ textDecoraction: "none", color: "black" }}
        >
          {session.production}
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Moment date={session.date.toDate()} format="DD/MM/YYYY" />
      </Table.Cell>
      <Table.Cell>
        <Link style={{ color: "green" }} to={`/sessions/${session.id}/edit`}>
          <Icon name="edit" />
        </Link>
        <Icon
          style={{ color: "red" }}
          link
          name="delete"
          onClick={() => deleteSession(session.id)}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default Session;
