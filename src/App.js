import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";
import Upload from "./pages/Upload/Upload";
import GlobalContextProvider from "./utils/GlobalContext";

const App = () => {
  return (
    <GlobalContextProvider>
      <div className={styles.container}>
        <Router>
          <Switch>
            <Route path="/" component={Upload} />
          </Switch>
        </Router>
      </div>
    </GlobalContextProvider>
  );
};

export default App;
