import { render } from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TodaysImage, Login, NotFound, User, AppHeader } from "./sections";
import { Viewer } from "./lib/types";
import reportWebVitals from "./reportWebVitals";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider, Frame } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { useState } from "react";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  console.log(viewer);
  return (
    <Router>
      <div className="main_wrapper">
        <AppHeader
          title="Spacestagram"
          subTitle="Brought to you by the NASA Astronomy Picture of the Day (APOD) API!"
        />
        <Routes>
          <Route path="/" element={<TodaysImage />} />
          <Route path="/login" element={<Login setViewer={setViewer} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </div>
    </Router>
  );
};

render(
  <ApolloProvider client={client}>
    <AppProvider i18n={enTranslations}>
      <App />
    </AppProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
