import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Segment, Input } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import { PageHero } from "../Ui";
import { updateDoc, addDoc, getDoc } from "../../services";
import "react-datepicker/dist/react-datepicker.css";

export const SessionForm = ({ history, match, sessionId, updateSession }) => {
  const id = sessionId || match.params.id;
  const [pageHeroHeader, setPageHeroHeader] = useState("צור יום צילום חדש");
  const [backLink, setBackLink] = useState("/");
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [production, setProduction] = useState("");

  useEffect(() => {
    if (!id) return;
    if (sessionId) {
      setBackLink(`/sessions/${sessionId}`);
    } else {
      setBackLink(`/sessions/`);
    }

    const getSession = async () => {
      setLoading(true);
      setPageHeroHeader("עדכן יום צילום");
      try {
        const session = await getDoc("sessions", id);
        setDate(new Date(session.date.toDate()));
        setProduction(session.production);
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getSession();
  }, [sessionId, id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (id) {
      try {
        await updateDoc("sessions", id, { date, production });
        if (sessionId) {
          updateSession({ date, production });
          setLoading(false);
        } else {
          history.push("/sessions");
        }
      } catch (err) {
        alert(err);
      }
    } else {
      try {
        const docRef = await addDoc("sessions", { date, production });
        history.push(`/sessions/${docRef.id}`);
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      {!sessionId && <PageHero header={pageHeroHeader} icon="sessionAdd" />}
      <Segment loading={isLoading}>
        <Form onSubmit={submit}>
          <Form.Group>
            <Form.Field width={8} required>
              <label>שם ההפקה:</label>
              <Input
                value={production}
                onChange={(e) => setProduction(e.target.value)}
                type="text"
                placeholder="הקלד שם הפקה ..."
              />
            </Form.Field>
            <Form.Field width={8} required>
              <label>תאריך:</label>
              <DatePicker
                selected={date}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setDate(date)}
              />
            </Form.Field>
          </Form.Group>
          <Button disabled={isLoading} loading={isLoading} color="green">
            שמור
          </Button>
          {!sessionId && (
            <Button
              disabled={isLoading}
              color="red"
              centered="true"
              as={Link}
              to={backLink}
            >
              ביטול
            </Button>
          )}
        </Form>
      </Segment>
    </>
  );
};
