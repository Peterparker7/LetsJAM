import "./App.css";
import Main from "./Pages/Main/Main";
import Create from "./Pages/Create/Create";
import Detail from "./Pages/Detail/Detail";
import Profile from "./Pages/Profile/Profile";
import BaseLogin from "./Pages/Login/BaseLogin";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import Error404 from "./Pages/Error404";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "./utils/firebase";
import { MyContext } from "./MyContext";

function App() {
  const [userUid, setUserUid] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUserUid, setIsLogIn);
    return unsubscribe;
  }, [isLogIn]);

  return (
    <div className="App">
      <MyContext.Provider value={{ userUid, setUserUid }}>
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

              <Detail userUid={userUid} />
              <Footer />
            </Route>
            <Redirect to="/error404" />
          </Switch>
        </MainDiv>
      </MyContext.Provider>
    </div>
  );
}

const MainDiv = styled.div`
  min-height: calc(100vh);
  background: black;
`;

export default App;
