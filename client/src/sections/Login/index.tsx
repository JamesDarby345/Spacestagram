import { useApolloClient } from "@apollo/react-hooks";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { Viewer } from "../../lib/types";

interface Props {
  setViewer: (viewer: Viewer) => void;
}
export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {}
  };
  const guestRedirect = () => {
    window.location.href = "/";
  };
  return (
    <div>
      <h2> Welcome to Spacestagram! </h2>
      <button onClick={handleAuthorize}>Sign in with Google</button>
      <button onClick={guestRedirect}>Continue as Guest</button>
    </div>
  );
};
