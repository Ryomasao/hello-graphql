import React from "react";

const Link = props => {
  return (
    <div>
      <div>
        {props.link.description}
        {props.link.url}
      </div>
    </div>
  );
};

export default Link;
