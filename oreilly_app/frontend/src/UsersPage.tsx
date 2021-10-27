import { gql, useQuery, useMutation } from "@apollo/client";
import { User, AuthenticatedUser } from "./models";
import MainTemplate from "./components/MainTemplate";
import { useEffect } from "react";

export const ROOT_QUERY = gql`
  query allUsers {
    me {
      ...userInfo
    }
    totalUsers
    allUsers {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`;

export type ROOT_DATA = {
  totalUsers: number;
  allUsers: Pick<User, "avatar" | "githubLogin" | "name">[];
  me: AuthenticatedUser;
  newUser: Pick<User, "avatar" | "githubLogin" | "name">
};

const UsersPage = () => {
  const { loading, data, refetch, subscribeToMore } = useQuery<ROOT_DATA>(
    ROOT_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );


  useEffect(() => {
    subscribeToMore({
      document: LISTEN_FOR_USERS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUser = subscriptionData.data.newUser
        return {
          ...prev, 
          totalUsers: prev.totalUsers + 1,
          allUsers: [...prev.allUsers, newUser]
          
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  //useSubscription(LISTEN_FOR_USERS, {
  //  onSubscriptionData: ({client, subscriptionData}) => {
  //    client.readQuery()
  //    client.watchQuery()
  //  }
  //});
  return (
    <MainTemplate>
      {loading ? (
        <p>...loading</p>
      ) : (
        data && (
          <div>
            <p>total:{data.totalUsers}</p>
            <UserList users={data.allUsers} refetch={refetch} />
          </div>
        )
      )}
    </MainTemplate>
  );
};

type Refetch = ReturnType<typeof useQuery>["refetch"];

const UserList = (props: {
  users: ROOT_DATA["allUsers"];
  refetch: Refetch;
}) => {
  const { users } = props;
  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION, {
    //refetchQueries: [
    //  { query:ROOT_QUERY },
    //  'GetRoot'
    //]
    // subscribe利用のため不要
    //update: (cache, { data }) => {
    //  const newUsers = data.addFakeUsers;
    //  // https://qiita.com/longtime1116/items/fc6530c4a30fedb59770
    //  // https://www.apollographql.com/docs/react/caching/cache-interaction/#combining-reads-and-writes
    //  const rootData = {
    //    ...cache.readQuery({ query: ROOT_QUERY }),
    //  } as ROOT_DATA;
    //  rootData.totalUsers += newUsers.length;
    //  rootData.allUsers = [...rootData.allUsers, ...newUsers];

    //  cache.writeQuery({ query: ROOT_QUERY, data: rootData });
    //},
  });

  return (
    <ul>
      <button onClick={() => props.refetch()} type="button">
        refetch user
      </button>
      <button
        onClick={() =>
          addFakeUsers({
            variables: { count: 1 },
          })
        }
        type="button"
      >
        add fake user
      </button>
      {users.map((user) => (
        <UserListItem user={user} key={user.githubLogin} />
      ))}
    </ul>
  );
};

const UserListItem = (props: { user: ROOT_DATA["allUsers"][0] }) => {
  const { user } = props;
  return (
    <li>
      <img src={user.avatar} alt={user.name} width={48} height={48} />
      {user.name}
    </li>
  );
};

export default UsersPage;
