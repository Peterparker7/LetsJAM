import "./App.css";
import Main from "./Pages/Main/Main";
import Create from "./Pages/Create/Create";
import Detail from "./Pages/Detail/Detail";
import Profile from "./Pages/Profile/Profile";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header/> */}
        <Switch>
          <Route exact path="/activities">
            <Main />
          </Route>
          <Route exact path="/activities/create">
            <Create />
          </Route>
          <Route exact path="/activities/profile">
            <Profile />
          </Route>
          <Route exact path="/activities/:id">
            <Detail />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
