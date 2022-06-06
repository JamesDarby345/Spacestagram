import { Avatar, Button } from "@shopify/polaris";
import { Viewer } from "../../lib/types";

interface Props {
  title: string;
  subTitle: string;
  viewer: Viewer;
}

const loginRedirect = () => {
  window.location.href = "/login";
};

const logout = () => {
  window.location.href = "/";
};

export const AppHeader = ({ title, subTitle, viewer }: Props) => {
  const logInButton =
    viewer.id && viewer.avatar ? (
      <div>
        <Avatar customer source={viewer.avatar} />
        <Button accessibilityLabel="Logout of Spacestagram" onClick={logout}>
          Logout
        </Button>
      </div>
    ) : (
      <Button
        accessibilityLabel="Login to Spacestagram with Google"
        onClick={loginRedirect}
      >
        Login
      </Button>
    );
  return (
    <div className="grid grid-flow-col">
      <div>
        <h1 className="main_title">{title}</h1>
        <h5 className="sub_title">{subTitle} </h5>
      </div>
      <div className="mt-[15px] justify-self-end">{logInButton}</div>
    </div>
  );
};
