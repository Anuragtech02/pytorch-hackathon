import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";
import Upload from "./pages/Upload/Upload";
import Result from "./pages/Result/Result";
import GlobalContextProvider from "./utils/GlobalContext";

const App = () => {
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
