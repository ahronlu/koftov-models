import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Header,
  Image,
  Segment,
  Tab,
  Table,
} from "semantic-ui-react";
import { deleteDoc, getDoc } from "../../services";
import { PageLoader } from "../Ui";
import modelAvatar from "./images/model-avatar.png";
import { ImageUpload } from "./ImageUpload/ImageUpload";
import { ModelForm } from "./ModelForm";
import { Documents } from "./Documents";
import ModelSessionTable from "./ModelSessionTable";

export const ModelDetailsPage = ({ match, history }) => {
  const [model, setModel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const modelId = match.params.id;

  useEffect(() => {
    const getModel = async () => {
      try {
        const model = await getDoc("models", modelId);
        setModel(model);
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getModel();
  }, [modelId]);

  const deleteModel = async () => {
    if (window.confirm("למחוק את המיוצג?")) {
      setLoading(true);
      try {
        await deleteDoc("models", modelId);
        history.push("/models");
      } catch (err) {
        alert(err);
      }
    }
  };

  const panes = [
    { menuItem: "פעולות" },
    {
      menuItem: "הצג היסטוריית ימי צילום",
      render: () => (
        <Tab.Pane>
          <ModelSessionTable modelId={modelId} model={model} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "עדכן תמונה",
      render: () => (
        <Tab.Pane>
          <ImageUpload modelId={modelId} setModel={setModel} model={model} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "עדכן פרטים",
      render: () => (
        <Tab.Pane>
          <ModelForm modelId={modelId} updateModel={setModel} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "מסמכים",
      render: () => (
        <Tab.Pane>
          <Documents modelId={modelId} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "מחק",
      render: () => (
        <Tab.Pane>
          <Button color="red" onClick={deleteModel}>
            מחק מיוצג
          </Button>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {model && (
            <>
              <Segment className="noprint" placeholder>
                <Header>
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <Divider horizontal>
                          <Header as="h2">{model.name}</Header>
                        </Divider>
                        <Segment textAlign="center">
                          <Grid>
                            <Grid.Column width={6} verticalAlign="middle">
                              <Image
                                src={model.image || modelAvatar}
                                className="image-prev"
                              />
                            </Grid.Column>
                            <Grid.Column width={10} verticalAlign="middle">
                              <h3>
                                {model.gender.toLowerCase() === "male"
                                  ? "זכר"
                                  : "נקבה"}
                              </h3>
                              <h3>{model.phone}</h3>
                            </Grid.Column>
                          </Grid>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Divider horizontal>
                          <Header as="h2">פרטים נוספים</Header>
                        </Divider>
                        <Segment>
                          <Table definition textAlign="right">
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell>גובה</Table.Cell>
                                <Table.Cell>
                                  {model.height && model.height + ' ס"מ'}
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>מידת נעליים</Table.Cell>
                                <Table.Cell>{model.shoeSize}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>מידת מכנסיים</Table.Cell>
                                <Table.Cell>{model.pantsSize}</Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>מידת חולצה</Table.Cell>
                                <Table.Cell>{model.shirtSize}</Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          </Table>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Header>
              </Segment>
              <Tab menu={{ attached: true }} panes={panes} />
            </>
          )}
        </>
      )}
    </>
  );
};
