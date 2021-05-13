import "./App.css";
import Main from "./Main";
import Create from "./Create";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header/> */}
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route exact path="/create">
            <Create />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
