import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "../../lib/types";
import { LOG_IN } from "../../lib/graphql/mutations/LogIn";
import { useEffect, useRef, useState } from "react";
import { Banner, Button, Spinner } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.id !== "" && data.logIn.id) {
          setViewer(data.logIn);
        }
      },
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      setAuthError(true);
    }
  };

  const errorBannerLogIn =
    logInError || authError ? (
      <Banner title="Logout Error" onDismiss={() => {}} status="warning">
        <p>
          There was an error with your login attempt. Please try again later.
        </p>
      </Banner>
    ) : null;

  const guestRedirect = () => {
    window.location.href = "/";
  };

  if (logInLoading) {
    return (
      <div className="grid place-content-center mt-[25vh] mb-[25vh]">
        <Spinner accessibilityLabel="Image spinner" size="large" />
        Logging in...
      </div>
    );
  }

  if (
    logInData &&
    logInData.logIn &&
    logInData.logIn.id !== "" &&
    logInData.logIn.id
  ) {
    navigate("/"); //TODO: This component updates viewer state on render causing a console warning
    //navigate preserves the warning, window.location.href doesn't
    // window.location.href = "/";
  }

  return (
    <div>
      <h2> Welcome to Spacestagram! </h2>
      <Button onClick={handleAuthorize}>Sign in with Google</Button>
      <Button onClick={guestRedirect}>Continue as Guest</Button>
      {errorBannerLogIn}
    </div>
  );
};
