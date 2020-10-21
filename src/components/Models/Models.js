import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Input,
  Message,
  Segment,
  Table,
} from "semantic-ui-react";
import { deleteDoc, getCollection, getDocs } from "../../services";
import { PageHero } from "../Ui";
import Model from "./Model";

const MODELS_PER_PAGE = 10;

export const Models = () => {
  const [submitCount, setSubmitCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [showMore, setShowMore] = useState(MODELS_PER_PAGE);
  const [queryType, setQueryType] = useState(true);

  const deleteModel = async (modelId) => {
    if (window.confirm("למחוק את המיוצג?")) {
      await deleteDoc("models", modelId);
      setModels(models.filter((model) => model.id !== modelId));
    }
  };

  useEffect(() => {
    const getModels = async () => {
      setError("");
      if (queryType) {
        setLoading(true);
        try {
          const result = await getDocs("models", "name", query, showMore);
          setLoading(false);
          setModels(result);
          if (result.length === 0) {
            setError("לא נמצאו תוצאות");
          }
        } catch (err) {
          setError("בעיה בחיבור אנא נסה שנית");
        }
        setSubmitCount(0);
      } else {
        setLoading(true);
        try {
          const result = await getCollection(
            "models",
            minAge,
            maxAge,
            showMore
          );
          setLoading(false);
          setModels(result);
          if (result.length === 0) {
            setError("לא נמצאו תוצאות");
          }
        } catch (err) {
          setError("בעיה בחיבור אנא נסה שנית");
        }
        setSubmitCount(0);
      }
    };

    submitCount && getModels();
  }, [submitCount, showMore, query, minAge, maxAge, queryType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitCount(submitCount + 1);
  };

  const changeQueryType = (e) => {
    setError("");
    setQuery("");
    setShowMore(MODELS_PER_PAGE);
    setQueryType((prevState) => !prevState);
  };

  return (
    <>
      <PageHero icon="modelSearch" header={`חיפוש מיוצגים`} />
      <Segment>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Field width={8} style={{ display: "flex" }}>
            <label>חפש לפי:</label>
            <select
              name="queryType"
              value={queryType}
              onChange={changeQueryType}
              required
            >
              <option value={true}>שם</option>
              <option value={false}>גיל</option>
            </select>
          </Form.Field>
          <Form.Group>
            <Form.Field width={10}>
              {queryType ? (
                <Input
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`חיפוש מיוצגים לפי ${queryType ? "שם" : "גיל"}`}
                  fluid={queryType ? true : false}
                />
              ) : (
                <Grid columns={2}>
                  <Grid.Column>
                    <Input
                      onChange={(e) => setMinAge(e.target.value)}
                      placeholder="מגיל"
                      type="number"
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      onChange={(e) => setMaxAge(e.target.value)}
                      placeholder="עד גיל"
                      type="number"
                    />
                  </Grid.Column>
                </Grid>
              )}
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
                    to="/createModel"
                    color="green"
                  >
                    צור מיוצג
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
          {models.length > 0 && (
            <Segment className="wrapped" loading={isLoading}>
              <Table
                unstackable
                selectable
                textAlign="center"
                verticalAlign="middle"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>שם מלא</Table.HeaderCell>
                    <Table.HeaderCell>מין</Table.HeaderCell>
                    <Table.HeaderCell>טלפון</Table.HeaderCell>
                    <Table.HeaderCell>עיר מגורים</Table.HeaderCell>
                    <Table.HeaderCell>שנת לידה</Table.HeaderCell>
                    <Table.HeaderCell>פעולות</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <>
                    {models.map((model) => (
                      <Model
                        key={model.id}
                        deleteModel={deleteModel}
                        model={model}
                      />
                    ))}
                  </>
                </Table.Body>
              </Table>
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
        </>
      )}
    </>
  );
};
