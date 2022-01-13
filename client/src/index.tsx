import { render } from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { NASAImages, TodaysImage } from "./sections";
import reportWebVitals from "./reportWebVitals";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <AppProvider i18n={enTranslations}>
      <TodaysImage
        title="Spacestagram"
        subTitle="Brought to you by the NASA Astronomy Picture of the Day (APOD) API!"
      />
      {/* <NASAImages /> */}
    </AppProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
