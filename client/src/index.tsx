import { render } from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { NASAImages } from "./sections";
import reportWebVitals from "./reportWebVitals";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <NASAImages title="Spacestagram" />,
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
