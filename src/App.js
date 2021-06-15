import "./App.css";
import Main from "./Pages/Main/Main";
import Create from "./Pages/Create/Create";
import Detail from "./Pages/Detail/Detail";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import BaseLogin from "./Pages/Login/BaseLogin";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import Error404 from "./Pages/Error404";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { getAuthUser } from "./utils/firebase";

function App() {
  const [userUid, setUserUid] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    setUserUid(userUid);
    if (userUid) {
      setIsLogIn(true);
    }
  };

  useEffect(() => {
    console.log("HHHHH");
    checkUserIsLogin();
  }, [isLogIn]);

  console.log(userUid);
  console.log(isLogIn);
  return (
    <div className="App">
      {/* <Router> */}
      {/* <Header userUid={userUid} /> */}

      <MainDiv>
        <Switch>
          <Route exact path="/">
            <Header userUid={userUid} />

            <Main />
            <Footer />
          </Route>
          <Route exact path="/activities/login">
            <Header userUid={userUid} />

            <BaseLogin userUid={userUid} setIsLogIn={setIsLogIn} />
            <Footer />
          </Route>
          <Route exact path="/activities">
            <Header userUid={userUid} />

            <Main userUid={userUid} />
            <Footer />
          </Route>
          <Route exact path="/activities/create">
            <Header userUid={userUid} />

            <Create userUid={userUid} />
            <Footer />
          </Route>
          <Route exact path="/activities/profile">
            <Header userUid={userUid} />

            <Profile
              userUid={userUid}
              setIsLogIn={setIsLogIn}
              isLogIn={isLogIn}
            />
            <Footer />
          </Route>
          <Route exact path="/error404">
            <Error404 />
          </Route>
          <Route exact path="/activities/:id">
            <Header userUid={userUid} />

            <Detail />
            <Footer />
          </Route>
          {/* 
          <Route path="/">
            <Main />
          </Route> */}
          <Redirect to="/error404" />
        </Switch>
      </MainDiv>
      {/* <Footer /> */}
      {/* </Router> */}
    </div>
  );
}

const MainDiv = styled.div`
  min-height: calc(100vh);
  background: black;
  /* padding-top: 1px; */
`;

export default App;
