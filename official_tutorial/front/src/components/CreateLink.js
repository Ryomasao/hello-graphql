import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const CreateLink = props => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = postMutation => {
    postMutation();
  };

  const POST_MUTATION = gql`
    mutation PostMutation($description: String!, $url: String!) {
      post(description: $description, url: $url) {
        id
        createdAt
        url
        description
      }
    }
  `;

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="description"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="url"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => props.history.push("/")}
      >
        {postMutation => (
          <button type="button" onClick={() => handleSubmit(postMutation)}>
            Submit
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default CreateLink;
