import React from "react";

import { AUTH_TOKEN } from "../constants";

const Link = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const handleVote = () => {};

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={handleVote}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description}
          {props.link.url}
        </div>
        <div className="f6 lh-copy gray">
          {props.link.votes.length} votes | by{`user name`}
          {props.link.postedBy ? props.link.postedBy.name : "Unknown"}
          {""}
          {/** TODO timediffer */}
        </div>
      </div>
    </div>
  );
};

export default Link;
