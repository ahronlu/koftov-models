import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import modelAdd from "./card-images/model-add.png";
import modelSearch from "./card-images/model-search.png";
import sessionAdd from "./card-images/session-add.png";
import sessionlSearch from "./card-images/session-search.png";

export const Home = () => {
  return (
    <>
      <Card.Group itemsPerRow={4} stackable>
        <Card as={Link} to="/createModel">
          <Image src={modelAdd} size="small" wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>צור מיוצג חדש</Card.Header>
          </Card.Content>
        </Card>
        <Card as={Link} to="/models">
          <Image src={modelSearch} size="small" wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>חפש מיוצג</Card.Header>
          </Card.Content>
        </Card>
        <Card as={Link} to="/createSession">
          <Image src={sessionAdd} size="small" wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>צור יום צילום חדש </Card.Header>
          </Card.Content>
        </Card>
        <Card as={Link} to="/sessions">
          <Image src={sessionlSearch} size="small" wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>חפש יום צילום</Card.Header>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
};
