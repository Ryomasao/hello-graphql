import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link";

const LinkList = props => {
  const FEED_QUERY = gql`
    {
      feed {
        links {
          id
          createdAt
          description
          url
          postedBy {
            name
          }
          votes {
            id
            user {
              name
            }
          }
        }
      }
    }
  `;

  // ApolloClientでqueryを直接発行して結果をrenderingする or
  // 以下のように、QueryHOCで書く
  // 後者のほうが宣言的なのでおすすめとのこと

  // HOC見慣れるとよさげだけど、どうなんだろ
  // HOOKSでuseQueryみたいなものがきっとあるんだろうな
  // あったw
  // https://www.apollographql.com/docs/react/api/react-hooks/

  return (
    <Query query={FEED_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        const linksToRender = data.feed.links;
        return linksToRender.map((link, index) => {
          return (
            <Link
              key={link.id}
              link={link}
              index={index}
              postedBy={link.postedBy}
              createdAt={link.createdAt}
            />
          );
        });
      }}
    </Query>
  );
};

export default LinkList;
