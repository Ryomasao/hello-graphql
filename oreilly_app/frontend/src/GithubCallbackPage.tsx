import { useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";
import { useHistory } from "react-router-dom";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const GithubCallbackPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const history = useHistory();

  const [githubAuth, { loading, error }] = useMutation(GITHUB_AUTH_MUTATION, {
    onCompleted: (data) => {
      const token = data.githubAuth.token;
      localStorage.setItem("token", token);
      history.push("/");
    },
    onError: (e) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("code")) {
      return;
    }
    const code = params.get("code") as string;
    setCode(code);
    githubAuth({ variables: { code } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (code === null) {
    return <h1>No code</h1>;
  }

  if (loading) {
    return <h1>...loading</h1>;
  }

  if (error) {
    return <h1>error</h1>;
  }

  return null
};

export default GithubCallbackPage;
