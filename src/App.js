import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";
import Upload from "./pages/Upload/Upload";
import Result from "./pages/Result/Result";
import GlobalContextProvider from "./utils/GlobalContext";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    // const a = document.createElement("a");
    // a.href = "http://164.52.218.27:3000";
    // a.click();
  }, []);

  return (
    <GlobalContextProvider>
      <div className={styles.container}>
        <Router>
          <Switch>
            <Route exact path="/" component={Upload} />
            <Route exact path="/predict" component={Result} />
          </Switch>
        </Router>
      </div>
    </GlobalContextProvider>
  );
};

export default App;
