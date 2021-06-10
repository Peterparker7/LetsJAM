import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

let userEmail = "";
let userPassword = "";
let userInfo = {};

function Login(props) {
  const [emailState, setEmailState] = useState(true);
  const [emailValue, setEmailValue] = useState();
  const [emailAuthState, setEmailAuthState] = useState(true);
  const [passwordState, setPasswordState] = useState(true);
  const [passwordValue, setPasswordValue] = useState(true);
  const [passwordAuthState, setPasswordAuthState] = useState(true);

  let history = useHistory();

  const handleEmailChange = (e) => {
    userEmail = e;
    setEmailValue(e);
    setEmailState(true);
    setEmailAuthState(true);
  };
  const handlePasswordChange = (e) => {
    userPassword = e;
    setPasswordValue(e);
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
          props.props.setIsLogIn(true);
        })
        .then(() => {
          history.push("/");
          // window.location.href = "./";
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

    if (!emailValue) {
      setEmailState(false);
      return false;
    } else if (emailValue) {
      setEmailState(true);
    }
    if (!passwordValue) {
      setPasswordState(false);
      return false;
    } else if (passwordValue) {
      setPasswordState(true);
      return true;
    }
  };
  const warningEmailHTML = () => {
    if (!emailState) {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          帳號不完整
        </Warning>
      );
    } else if (!emailAuthState) {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          無效帳號
        </Warning>
      );
    }
  };
  const warningPasswordHTML = () => {
    if (!passwordState) {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          密碼不完整
        </Warning>
      );
    } else if (!passwordAuthState) {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          密碼錯誤
        </Warning>
      );
    }
  };

  const loginHTML = () => {
    return (
      <div>
        <ItemField>
          <Label for="email">帳號</Label>
          <InputField
            id="email"
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
            style={
              emailState && emailAuthState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningEmailHTML()}
        </ItemField>
        <ItemField>
          <Label for="password">密碼</Label>
          <InputField
            id="password"
            type="password"
            onChange={(e) => {
              handlePasswordChange(e.target.value);
            }}
            style={
              passwordState && passwordAuthState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningPasswordHTML()}
        </ItemField>

        <LoginButton onClick={(e) => handleLogin()}>登入</LoginButton>
      </div>
    );
  };

  return (
    <div>
      <div>{loginHTML()}</div>
    </div>
  );
}

const ItemField = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin: 30px 0 30px 0;
`;
const Label = styled.label`
  display: inline-block;
  width: 80px;
`;

const InputField = styled.input`
  padding: 5px;
  width: 250px;
  height: 38px;
`;
const Warning = styled.div`
  width: 80px;
  font-size: 12px;
`;

const RequireField = styled.span`
  color: red;
`;
const LoginButton = styled.button`
  /* width: 90px; */
  padding: 12px 40px;
  align-items: center;
  margin: 0 auto;

  background: #121212;
  color: #fff;
  border: 1px solid #979797;
  border-radius: 4px;
  margin-top: 30px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.85;
    transform: translateY(-2px);
  }
`;
export default Login;
