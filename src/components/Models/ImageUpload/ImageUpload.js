import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Input,
  Segment,
} from "semantic-ui-react";
import { db, storage } from "../../../firebase";
import "./ImageUpload.scss";

export const ImageUpload = ({ modelId, setModel, model }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!modelId || !image) return;
    setLoading(true);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(modelId + ".jpg");
    try {
      await fileRef.put(image);
      const fileUrl = await fileRef.getDownloadURL();
      await db.collection("models").doc(modelId).update({
        image: fileUrl,
      });
      setModel({ ...model, image: fileUrl });
      setImage(null);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  return (
    <div className="ImageUpload">
      <Segment>
        <Header>בחר תמונה</Header>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Field width={10}>
              <Input name="fileInput" type="file" onChange={onFileChange} />
            </Form.Field>
            <Form.Field width={6}>
              <Grid columns={2} divided>
                <Grid.Column>
                  <Button
                    fluid
                    color="green"
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    עדכן תמונה
                  </Button>
                </Grid.Column>
              </Grid>
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
      <Segment loading={isLoading} className="image-preview-segment">
        <Header>תצוגה מקדימה</Header>
        {image && (
          <Image
            src={URL.createObjectURL(image)}
            alt="image"
            className="image-prev"
          />
        )}
      </Segment>
    </div>
  );
};
