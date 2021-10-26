import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
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

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`

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
  const [ addFakeUsers ] =  useMutation(ADD_FAKE_USERS_MUTATION, {
    refetchQueries: [
      { query:ROOT_QUERY }, 
      'GetRoot' 
    ]
  })

  return (
    <ul>
			<button onClick={() => props.refetch()} type="button">refetch user</button>
      <button onClick={() => addFakeUsers({
          variables: {count: 1}, 
       })} 
        type="button">
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

export default Users;
