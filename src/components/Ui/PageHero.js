import React from "react";
import Moment from "react-moment";
import { Header, Image, Segment } from "semantic-ui-react";
import modelAdd from "../Ui/card-images/model-add.png";
import modelSearch from "../Ui/card-images/model-search.png";
import sessionAdd from "../Ui/card-images/session-add.png";
import sessionSearch from "../Ui/card-images/session-search.png";

export const PageHero = ({ header, icon, date = null }) => {
  const changeIcon = (iconName) => {
    switch (iconName) {
      case "modelAdd":
        return modelAdd;
      case "modelSearch":
        return modelSearch;
      case "sessionAdd":
        return sessionAdd;
      case "sessionlSearch":
        return sessionSearch;
      default:
        return modelAdd;
    }
  };

  return (
    <div className="noprint">
      <Segment style={{ minHeight: "5rem" }} placeholder>
        <Header textAlign="center">
          <Image src={changeIcon(icon)} size="large" />
          <h1>
            {header} {date && <Moment date={date} format="DD/MM/YYYY" />}
          </h1>
        </Header>
      </Segment>
    </div>
  );
};
