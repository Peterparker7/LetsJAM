import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

let userEmail = "";
let userPassword = "";
let userInfo = {};

function Login() {
  const [emailState, setEmailState] = useState(true);
  const [emailAuthState, setEmailAuthState] = useState(true);
  const [passwordState, setPasswordState] = useState(true);
  const [passwordAuthState, setPasswordAuthState] = useState(true);

  const handleEmailChange = (e) => {
    userEmail = e;
    setEmailState(true);
    setEmailAuthState(true);
  };
  const handlePasswordChange = (e) => {
    userPassword = e;
    setPasswordState(true);
    setPasswordAuthState(true);
  };

  const handleLogin = () => {
    if (formCheck()) {
      // //登入
      window.firebase
        .auth()
        .signInWithEmailAndPassword(userEmail, userPassword)
        .then((result) => {
          console.log("Login");
          console.log(result.uid);
          alert("登入成功！");
        })
        .then(() => {
          window.location.href = "./";
        })
        .catch((error) => {
          console.log(error);
          console.log(error.message);
          if (error.code === "auth/wrong-password") {
            setPasswordAuthState(false);
            return;
          }
          if (error.code === "auth/invalid-email") {
            setEmailAuthState(false);
            return;
          }
          alert(error.message);
        });
    }
  };

  console.log(userInfo);
  console.log(userEmail);
  console.log(userPassword);

  const formCheck = () => {
    // userInfo = { ...userInfo, skill: skillArray };

    let email = document.querySelector("#email");
    let password = document.querySelector("#password");

    if (!email.value) {
      setEmailState(false);
      return false;
    } else if (email.value) {
      setEmailState(true);
    }
    if (!password.value) {
      setPasswordState(false);
      return false;
    } else if (password.value) {
      setPasswordState(true);
      return true;
    }
  };
  const warningEmailHTML = () => {
    if (!emailState) {
      return (
        <div style={{ display: "inline-block", color: "red" }}>帳號不完整</div>
      );
    } else if (!emailAuthState) {
      return (
        <div style={{ display: "inline-block", color: "red" }}>無效帳號</div>
      );
    }
  };
  const warningPasswordHTML = () => {
    if (!passwordState) {
      return (
        <div style={{ display: "inline-block", color: "red" }}>密碼不完整</div>
      );
    } else if (!passwordAuthState) {
      return (
        <div style={{ display: "inline-block", color: "red" }}>密碼錯誤</div>
      );
    }
  };

  const loginHTML = () => {
    return (
      <div>
        <div>
          <RequireField>*</RequireField>
          <label for="email">帳號</label>
          <InputField
            id="email"
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
            style={
              emailState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningEmailHTML()}
        </div>
        <div>
          <RequireField>*</RequireField>

          <label for="password">密碼</label>
          <InputField
            id="password"
            type="password"
            onChange={(e) => {
              handlePasswordChange(e.target.value);
            }}
            style={
              passwordState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningPasswordHTML()}
        </div>

        <button onClick={(e) => handleLogin()}>登入</button>
      </div>
    );
  };

  return (
    <div>
      <div>{loginHTML()}</div>
    </div>
  );
}

const InputField = styled.input`
  border: 1px solid #979797;
`;

const RequireField = styled.span`
  color: red;
`;

export default Login;
