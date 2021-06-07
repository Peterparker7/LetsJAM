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
import React, { useEffect, useState } from "react";
import { getAuthUser } from "./utils/firebase";

function App() {
  const [userUid, setUserUid] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    setUserUid(userUid);
  };

  useEffect(() => {
    console.log("HHHHH");
    checkUserIsLogin();
  }, [isLogIn]);

  return (
    <div className="App">
      <Router>
        <Header userUid={userUid} />

        <MainDiv>
          <Switch>
            <Route exact path="/activities/login">
              <BaseLogin userUid={userUid} setIsLogIn={setIsLogIn} />
            </Route>
            <Route exact path="/activities">
              <Main userUid={userUid} />
            </Route>
            <Route exact path="/activities/create">
              <Create userUid={userUid} />
            </Route>
            <Route exact path="/activities/profile">
              <Profile userUid={userUid} setIsLogIn={setIsLogIn} />
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
  background: black;
  padding-top: 1px;
`;

export default App;
