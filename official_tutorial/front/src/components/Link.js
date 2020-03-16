import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";

const Link = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const VOTE_MUTATION = gql`
    mutation VoteMutation($linkId: ID!) {
      vote(linkId: $linkId) {
        id
      }
    }
  `;

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: props.link.id }}
          >
            {voteMutation => {
              return (
                <div
                  className="ml1 gray f11"
                  style={{ cursor: "pointer" }}
                  onClick={voteMutation}
                >
                  ▲
                </div>
              );
            }}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description}
          {props.link.url}
        </div>
        <div className="f6 lh-copy gray">
          {props.link.votes.length} votes | by{`user name`}
          {props.link.postedBy ? props.link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
