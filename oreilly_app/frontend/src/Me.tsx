import { useQuery, useApolloClient } from "react-apollo";
import { AuthenticatedUser } from "./models";
import { ROOT_QUERY, ROOT_DATA } from "./UsersPage";

type Props = {};

const Me = (props: Props) => {
  const { loading, data } = useQuery<ROOT_DATA>(ROOT_QUERY);
  const handleSignIn = () => {
    const CLIENT_ID = "0661831355c52024ee08";
    const ENDPOINT = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`;
    window.location.assign(ENDPOINT);
  };

  const client = useApolloClient()

  const handleLogout  = () => {
    localStorage.removeItem('token')
    client.resetStore()
  }
	
	if(loading) {
		return <div>...loading</div>
	}

	if(data && data.me) {
		return <CurrentUser user={data.me} onLogout={handleLogout}/>
	}

  return (
    <div>
      <button type="button" onClick={handleSignIn}>
        sign in
      </button>
    </div>
  );
};

const CurrentUser = (props: {
  user:AuthenticatedUser
  onLogout: () => void
} ) => {

  const user = props.user

  return (
    <div>
      <img src={user.avatar} alt={user.name} width={48} height={48} />
      {user.name}
      <button type="button" onClick={props.onLogout}>
        logout
      </button>
    </div>
  );
};

export default Me;
