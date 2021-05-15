import "./App.css";
import Main from "./Main";
import Create from "./Create";
import Detail from "./Detail";
import Profile from "./Profile";
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
