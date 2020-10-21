import React from "react";
import { Grid, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import modelAvatar from "../Models/images/model-avatar.png";

const ModelRadioDetails = ({ model }) => {
  return (
    <Grid verticalAlign="middle" stackable columns={4}>
      <Grid.Column>
        <Image src={model.image || modelAvatar} size="large" />
      </Grid.Column>
      <Grid.Column>
        <Link
          key={model.id}
          to={`/models/${model.id}`}
          style={{ textDecoraction: "none", color: "black" }}
        >
          {model.name}
        </Link>
      </Grid.Column>
      <Grid.Column>{`טלפון: ${model.phone}`}</Grid.Column>
      <Grid.Column>{`עיר: ${model.city}`}</Grid.Column>
    </Grid>
  );
};

export default ModelRadioDetails;
