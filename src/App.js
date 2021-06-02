import "./App.css";
import Main from "./Pages/Main/Main";
import Create from "./Pages/Create/Create";
import Detail from "./Pages/Detail/Detail";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import BaseLogin from "./Pages/Login/BaseLogin";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <MainDiv>
          <Switch>
            <Route exact path="/activities/login">
              <BaseLogin />
            </Route>
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
        </MainDiv>
        <Footer />
      </Router>
    </div>
  );
}

const MainDiv = styled.div`
  min-height: calc(100vh - 180px);
`;

export default App;
