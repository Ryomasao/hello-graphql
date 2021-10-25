import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
import { User } from "./models";

const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

type ROOT_DATA = {
  totalUsers: number;
  allUsers: Pick<User, "avatar" | "githubLogin" | "name">[];
};

const Users = () => {
  const { loading, data, refetch } = useQuery<ROOT_DATA>(ROOT_QUERY);

  return (
    <div>
      {loading ? <p>...loading</p> : data && 
			<div>
				<p>total:{data.totalUsers}</p>
				<UserList users={data.allUsers} refetch={refetch}/>
			</div>
			}
    </div>
  );
};

type Refetch = ReturnType<typeof useQuery>['refetch']

const UserList = (props: { 
	users: ROOT_DATA["allUsers"]
	refetch: Refetch
}) => {
  const { users } = props;
  return (
    <ul>
			<button onClick={() => props.refetch()} type="button">refetch user</button>
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

export default Users;
