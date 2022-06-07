import { Button, TextStyle } from "@shopify/polaris";

const notFoundRedirect = () => {
  window.location.href = "/";
};

export const NotFound = () => {
  return (
    <div className="mt-6">
      <span className="mr-6">
        <TextStyle variation="negative">Error: Page Not Found</TextStyle>
      </span>

      <Button onClick={notFoundRedirect}>Return to main page</Button>
    </div>
  );
};
