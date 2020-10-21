import React, { useState } from "react";
import { Modal, Form, Segment, Input, Button, Grid } from "semantic-ui-react";
import "./EditModelSession.scss";

export const EditModelSession = ({
  showModalForm,
  setShowModalForm,
  doc,
  updateModelSession,
  model,
}) => {
  const [modelSession, setModelSession] = useState(doc);

  const closeModal = () => {};

  const handleSelectChange = (e) => {
    setModelSession({
      ...modelSession,
      [e.target.name]: Boolean(e.target.value),
    });
  };

  const editModelSession = async (e) => {
    e.preventDefault();
    await updateModelSession(modelSession);
    setShowModalForm(false);
  };

  return (
    <Modal
      open={showModalForm}
      onClose={closeModal}
      style={{ textAlign: "right" }}
    >
      <Modal.Header>עריכת מיוצג {model.name} יום בצילום</Modal.Header>
      {modelSession && (
        <Modal.Content>
          <Segment>
            <Segment key={modelSession.id}>
              <Grid verticalAlign="middle" stackable key={modelSession.id}>
                <Grid.Column>
                  <Form onSubmit={(e) => editModelSession(e)}>
                    <Form.Group>
                      <Form.Field required>
                        <label>הסעה:</label>
                        <select
                          name="hasTransportation"
                          onChange={handleSelectChange}
                          defaultValue={modelSession.hasTransportation}
                        >
                          <option value={""}>עצמאית</option>
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
                          value={modelSession.payment}
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
                          defaultValue={modelSession.isPaid}
                        >
                          <option value={""}>לא שולם</option>
                          <option value={true}>שולם</option>
                        </select>
                      </Form.Field>
                    </Form.Group>
                    <Form.Field>
                      <Button type="submit" color="green">
                        עדכן
                      </Button>
                      <Button
                        type="button"
                        color="red"
                        onClick={() => setShowModalForm(false)}
                      >
                        ביטול
                      </Button>
                    </Form.Field>
                  </Form>
                </Grid.Column>
              </Grid>
            </Segment>
          </Segment>
        </Modal.Content>
      )}
    </Modal>
  );
};
