import { User } from "./models";

type UserListUser = Pick<User, "avatar" | "githubLogin" | "name">

const UserList = (props: {
  users: UserListUser[];
  onClickRefetch: () => void;
  onClickAddFakeUser: () => void;
}) => {
  const { users } = props;
  return (
    <ul>
      <button onClick={props.onClickRefetch} type="button">
        refetch user
      </button>
      <button
        onClick={props.onClickAddFakeUser}
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

const UserListItem = (props: { user: UserListUser }) => {
  const { user } = props;
  return (
    <li>
      <img src={user.avatar} alt={user.name} width={48} height={48} />
      {user.name}
    </li>
  );
};

export default UserList