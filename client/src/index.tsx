import { render } from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TodaysImage, Login, NotFound, User, AppHeader } from "./sections";
import { Viewer } from "./lib/types";
import reportWebVitals from "./reportWebVitals";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider, Frame } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { useState, useEffect, useRef } from "react";
import { LOG_IN } from "./lib/graphql/mutations/LogIn";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  name: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  return (
    <Router>
      <div className="main_wrapper">
        <AppHeader
          title="Spacestagram"
          subTitle="Brought to you by the NASA Astronomy Picture of the Day (APOD) API!"
          viewer={viewer}
          setViewer={setViewer}
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
      <Frame>
        <App />
      </Frame>
    </AppProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
