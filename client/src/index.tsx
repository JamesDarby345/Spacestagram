import { render } from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { NASAImages, TodaysImage } from "./sections";
import reportWebVitals from "./reportWebVitals";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <AppProvider
      i18n={{
        Polaris: {
          ResourceList: {
            sortingLabel: "Sort by",
            defaultItemSingular: "item",
            defaultItemPlural: "items",
            showing: "Showing {itemsCount} {resource}",
            Item: {
              viewItem: "View details for {itemName}",
            },
          },
          Common: {
            checkbox: "checkbox",
          },
        },
      }}
    >
      <TodaysImage title="Spacestagram" />
      <NASAImages />
    </AppProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
