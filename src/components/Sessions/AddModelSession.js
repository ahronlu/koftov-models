import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
  Segment,
} from "semantic-ui-react";
import { addDoc, getDocs } from "../../services";
import "./AddModelSession.scss";
import ModelCheckbox from "./ModelRadioDetails";

const MODELS_PER_PAGE = 10;

export const AddModelSession = ({ sessionId, history }) => {
  const [submitCount, setSubmitCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(MODELS_PER_PAGE);
  const [modelSession, setModelSession] = useState({
    sessionId: sessionId,
    modelId: "",
    hasTransportation: false,
    payment: undefined,
    isPaid: false,
  });

  const handleSelectChange = (e) => {
    setModelSession({
      ...modelSession,
      [e.target.name]: Boolean(e.target.value),
    });
  };

  useEffect(() => {
    const findModel = async (e) => {
      setError("");
      if (!query) {
        setError("נא הזן לפחות אות אחת לחיפוש");
        setSubmitCount(0);
        return;
      }
      setLoading(true);
      const models = await getDocs("models", "name", query, showMore);
      setModels(models);
      setLoading(false);
      if (models.length === 0) {
        setError("לא נמצאו תוצאות");
      }
      setSubmitCount(0);
    };
    submitCount && findModel();
  }, [submitCount, showMore, query]);

  const submit = async (e) => {
    e.preventDefault();
    await addDoc("modelSessions", modelSession);
    window.location.reload();
    history.push(`/sessions/${sessionId}/1`);
  };

  return (
    <Container className="AddModelSession">
      <Segment>
        <Header>חפש מיוצג:</Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitCount(1);
          }}
        >
          <Form.Group>
            <Form.Field width={13}>
              <Input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="הכנס שם מיוצג"
                error={!!error}
                fluid
              />
            </Form.Field>
            <Form.Field width={3}>
              <Grid columns={1}>
                <Grid.Column>
                  <Button
                    disabled={isLoading || !query}
                    loading={isLoading}
                    type="submit"
                    color="blue"
                  >
                    חפש
                  </Button>
                </Grid.Column>
              </Grid>
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
      {error && <Message negative header={error} />}
      {models.length > 0 && (
        <Segment loading={isLoading}>
          <Header>
            <Message positive>
              <Icon name="check circle outline" size="large" />
              <Message.Content>
                {`נמצאו ${models.length >= showMore * 1 ? "מעל" : ""} ${
                  models.length
                } תוצאות:`}
              </Message.Content>
            </Message>
          </Header>
          {models.map((model, index) => (
            <Segment key={model.id}>
              <Grid verticalAlign="middle" stackable columns={3} key={model.id}>
                <Grid.Column width={1}>
                  <input
                    type="radio"
                    onChange={(e) =>
                      setModelSession({
                        ...modelSession,
                        modelId: e.target.value,
                      })
                    }
                    name="modelRadio"
                    value={model.id}
                  />
                </Grid.Column>
                <Grid.Column width={7}>
                  <ModelCheckbox key={model.id} model={model} />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Form onSubmit={(e) => submit(e)}>
                    <Form.Group>
                      <Form.Field required>
                        <label>הסעה:</label>
                        <select
                          name="hasTransportation"
                          onChange={handleSelectChange}
                          required
                        >
                          <option value={false} defaultValue>
                            עצמאית
                          </option>
                          <option value={true}>הסעה</option>
                        </select>
                      </Form.Field>
                      <Form.Field required>
                        <label>תשלום</label>
                        <Input
                          name="payment"
                          onChange={(e) =>
                            setModelSession({
                              ...modelSession,
                              [e.target.name]: Number(e.target.value),
                            })
                          }
                          type="number"
                          placeholder="הכנס סכום"
                          required
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>שולם \ לא שולם</label>
                        <select
                          name="isPaid"
                          onChange={handleSelectChange}
                          required
                        >
                          <option value={false}>לא שולם</option>
                          <option value={true}>שולם</option>
                        </select>
                      </Form.Field>
                      <Form.Field>
                        {model.id === modelSession.modelId && (
                          <>
                            <label>בחר</label>
                            <Button type="submit" color="green">
                              הוסף
                            </Button>
                          </>
                        )}
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </Grid.Column>
              </Grid>
            </Segment>
          ))}
          <Button
            color="green"
            disabled={models.length < showMore * 1}
            onClick={() => {
              setSubmitCount(1);
              setShowMore(showMore + MODELS_PER_PAGE);
            }}
          >
            הצג עוד מיוצגים
          </Button>
        </Segment>
      )}
    </Container>
  );
};
