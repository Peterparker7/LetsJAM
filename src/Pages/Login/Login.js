import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

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
          // alert("登入成功！");
          props.props.setIsLogIn(true);
        })
        .then(() => {
          Swal.fire({
            title: "<span style=font-size:24px>登入成功！歡迎回來</span>",
            customClass: "customSwal2Title",
            background: "black",
            showConfirmButton: false,
            timer: 2000,
          });
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
          if (error.code === "auth/user-not-found") {
            Swal.fire({
              title: "<span style=font-size:24px>無此帳號</span>",
              customClass: "customSwal2Title",
              background: "black",
              showConfirmButton: false,
              timer: 2000,
            });
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
      <ItemFieldContainer>
        <ItemField>
          <Label htmlFor="email">帳號</Label>
          <InputField
            id="email"
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
            style={
              emailState && emailAuthState
                ? { border: "1px solid #b7b7b7" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningEmailHTML()}
        </ItemField>
        <ItemField>
          <Label htmlFor="password">密碼</Label>
          <InputField
            id="password"
            type="password"
            onChange={(e) => {
              handlePasswordChange(e.target.value);
            }}
            style={
              passwordState && passwordAuthState
                ? { border: "1px solid #b7b7b7" }
                : { border: "1px solid red" }
            }
          ></InputField>
          {warningPasswordHTML()}
        </ItemField>
        <TestAccount>Test Account : test@gmail.com/000000</TestAccount>

        <LoginButton onClick={(e) => handleLogin()}>登入</LoginButton>
      </ItemFieldContainer>
    );
  };

  return (
    <div>
      <Container>{loginHTML()}</Container>
    </div>
  );
}
const Container = styled.div``;
const TestAccount = styled.div`
  color: #979797;
`;
const ItemFieldContainer = styled.div`
  margin: 0 auto;
  /* width: 90%; */
`;
const ItemField = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin: 30px 0 30px 0;
  position: relative;
  color: #2f2f2f;
`;
const Label = styled.label`
  display: inline-block;
  width: 80px;
`;

const InputField = styled.input`
  padding: 5px;
  width: 250px;
  height: 38px;
  margin: 0 10px;
  @media (max-width: 576px) {
    max-width: 70%;
  }
  @media (max-width: 414px) {
    max-width: 200px;
  }
`;
const Warning = styled.div`
  width: 80px;
  font-size: 12px;
  position: absolute;
  bottom: -20px;
  left: 70px;
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
  font-weight: 500;
  border: 1px solid none;
  border-radius: 8px;
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
