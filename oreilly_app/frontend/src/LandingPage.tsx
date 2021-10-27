import { useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { User, AuthenticatedUser, Photo } from "./models";
import MainTemplate from "./components/MainTemplate";
import UserList from "./UserList";
import PhotoList from "./PhotoList";
import './LandingPage.css'

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    me {
      ...userInfo
    }
    allUsers {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
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
  totalPhotos: number;
  allUsers: Pick<User, "avatar" | "githubLogin" | "name">[];
  allPhotos: Photo[];
  me: AuthenticatedUser;
  newUser: Pick<User, "avatar" | "githubLogin" | "name">;
};

const LandingPage = () => {
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
        const newUser = subscriptionData.data.newUser;
        return {
          ...prev,
          totalUsers: prev.totalUsers + 1,
          allUsers: [...prev.allUsers, newUser],
        };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefetch = () => {
    refetch();
  };

  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION);

  const handleAddFackeUser = () => {
    addFakeUsers({ variables: { count: 1 } });
  };

  return (
    <MainTemplate>
      {loading ? (
        <p>...loading</p>
      ) : (
        data && (
          <div className="container">
            <div className="left">
              <p>total:{data.totalUsers}</p>
              <UserList
                users={data.allUsers}
                onClickRefetch={handleRefetch}
                onClickAddFakeUser={handleAddFackeUser}
              />
            </div>
            <div className="right">
              <PhotoList photos={data.allPhotos} />
            </div>
          </div>
        )
      )}
    </MainTemplate>
  );
};

export default LandingPage;
