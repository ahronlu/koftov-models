import React from "react";
import { Image } from "semantic-ui-react";
import "./ModelImage.scss";

const ModelImage = ({ image, size }) => {
  return (
    <Image
      src={image}
      size={size || "small"}
      alt="model image"
      className="ModelImage"
    />
  );
};

export default ModelImage;
