import { Button, TopBar } from "@shopify/polaris";

interface Props {
  title: string;
  subTitle: string;
}

const loginRedirect = () => {
  window.location.href = "/login";
};

export const AppHeader = ({ title, subTitle }: Props) => {
  return (
    <div className="grid_container">
      <div>
        <h1 className="main_title">{title}</h1>
        <h5 className="sub_title">{subTitle} </h5>
      </div>
      <div className="header_login">
        <Button
          accessibilityLabel="Login to Spacestagram with Google"
          onClick={loginRedirect}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
