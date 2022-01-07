import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router } from "react-router-dom";

import AppProvider from "./contexts/AppProvider";
import { RoutedContent } from "./components";

const basePath = process.env.BASE_PATH || "/";

const App = () => {
  return (
    <AppProvider>
      <Router basename={basePath}>
        <RoutedContent />
      </Router>
    </AppProvider>
  );
};

export default hot(module)(App);
