import { useMutation } from "@apollo/react-hooks";
import { Avatar, Banner, Button, Toast } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { LOG_OUT } from "../../lib/graphql/mutations/LogOut";
import { LogOut as LogOutData } from "../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { Viewer } from "../../lib/types";

interface Props {
  title: string;
  subTitle: string;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const loginRedirect = () => {
  window.location.href = "/login";
};

export const AppHeader = ({ title, subTitle, viewer, setViewer }: Props) => {
  const [active, setActive] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleLogoutError = useCallback(
    () => setLogoutError((logoutError) => !logoutError),
    []
  );

  const toastLogOut = active ? (
    <Toast content="Logout successful" onDismiss={toggleActive} />
  ) : null;

  const errorBannerLogOut = logoutError ? (
    <Banner title="Logout Error" onDismiss={toggleLogoutError} status="warning">
      <p>
        There was an error with your logout attempt. Please try again later.
      </p>
    </Banner>
  ) : null;

  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        setActive(true);
      }
    },
    onError: () => {
      setLogoutError(true);
    },
  });

  const handleLogout = () => {
    logOut();
  };

  const loggedInAvatar =
    viewer.id && viewer.avatar ? (
      <div className="mt-[14px] mr-2 justify-self-end">
        <Avatar customer source={viewer.avatar} />
      </div>
    ) : null;

  const logInButton = viewer.id ? (
    <div>
      <Button
        accessibilityLabel="Logout of Spacestagram"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  ) : (
    <div>
      <Button
        accessibilityLabel="Login to Spacestagram with Google"
        onClick={loginRedirect}
      >
        Login
      </Button>
    </div>
  );
  return (
    <div className="grid grid-flow-col">
      <div>
        <h1 className="main_title">{title}</h1>
        <h5 className="sub_title">{subTitle} </h5>
      </div>
      <div className="grid grid-flow-col auto-cols-min justify-end">
        {loggedInAvatar}
        <div className="mt-[15px]">{logInButton}</div>
      </div>
      {toastLogOut}
      {errorBannerLogOut}
    </div>
  );
};
