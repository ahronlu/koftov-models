import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Form,
  Segment,
  Grid,
  Message,
} from "semantic-ui-react";
import Session from "./Session";
import { PageHero } from "../Ui";
import { deleteDoc, getDocs } from "../../services";

const SESSIONS_PER_PAGE = 10;

export const Sessions = () => {
  const [submitCount, setSubmitCount] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(SESSIONS_PER_PAGE);

  const deleteSession = async (sessionId) => {
    if (window.confirm("למחוק את יום הצילום?")) {
      try {
        await deleteDoc("sessions", sessionId);
        setSessions(sessions.filter((session) => session.id !== sessionId));
      } catch (err) {
        setError(err);
      }
    }
  };

  useEffect(() => {
    const getSessions = async () => {
      setError("");
      setLoading(true);
      try {
        const result = await getDocs("sessions", "production", query, showMore);
        setLoading(false);
        setSessions(result.sort((a, b) => b.date - a.date));
        if (result.length === 0) {
          setError("לא נמצאו תוצאות");
        }
      } catch (err) {
        setError("בעיה בחיבור אנא נסה שנית");
      }
      setSubmitCount(0);
    };

    submitCount && getSessions();
  }, [submitCount, showMore, query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitCount(1);
  };

  return (
    <>
      <>
        <PageHero icon="sessionSearch" header="חיפוש ימי צילום" />
        <Segment>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group>
              <Form.Field width={10}>
                <Input
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="הכנס שם הפקה"
                  fluid
                />
              </Form.Field>
              <Form.Field width={6}>
                <Grid columns={2}>
                  <Grid.Column>
                    <Button
                      color="blue"
                      fluid
                      disabled={isLoading}
                      loading={isLoading}
                      type="submit"
                    >
                      חפש
                    </Button>
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      fluid
                      disabled={isLoading}
                      as={Link}
                      to="/createSession"
                      color="green"
                    >
                      צור יום צילום
                    </Button>
                  </Grid.Column>
                </Grid>
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
        {error ? (
          <Message error content={error} />
        ) : (
          <>
            {sessions.length > 0 && (
              <Segment loading={isLoading} className="wrapped">
                <Table
                  unstackable
                  selectable
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>הפקה</Table.HeaderCell>
                      <Table.HeaderCell>תאריך</Table.HeaderCell>
                      <Table.HeaderCell>פעולות</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {sessions.map((session) => (
                      <Session
                        key={session.id}
                        deleteSession={deleteSession}
                        session={session}
                      />
                    ))}
                  </Table.Body>
                </Table>
                <Button
                  color="green"
                  disabled={sessions.length < showMore * 1}
                  onClick={() => {
                    setSubmitCount(1);
                    setShowMore(showMore + SESSIONS_PER_PAGE);
                  }}
                >
                  הצג עוד ימי צילום
                </Button>
              </Segment>
            )}
          </>
        )}
      </>
    </>
  );
};
