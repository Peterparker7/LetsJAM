import "../../App.css";
import firebase from "firebase/app";
import "firebase/auth";
import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

function Login(props) {
  const [emailState, setEmailState] = useState(true);
  const [emailValue, setEmailValue] = useState();
  const [emailAuthState, setEmailAuthState] = useState(true);
  const [passwordState, setPasswordState] = useState(true);
  const [passwordValue, setPasswordValue] = useState();
  const [passwordAuthState, setPasswordAuthState] = useState(true);

  let history = useHistory();

  const handleEmailChange = (e) => {
    setEmailValue(e);
    setEmailState(true);
    setEmailAuthState(true);
  };
  const handlePasswordChange = (e) => {
    setPasswordValue(e);
    setPasswordState(true);
    setPasswordAuthState(true);
  };

  const handleLogin = () => {
    if (formCheck()) {
      firebase
        .auth()
        .signInWithEmailAndPassword(emailValue, passwordValue)
        .then((result) => {
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
        })
        .catch((error) => {
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

  const formCheck = () => {
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
      return <Warning data-testid="emailWarning">帳號不完整</Warning>;
    } else if (!emailAuthState) {
      return <Warning>無效帳號</Warning>;
    }
  };
  const warningPasswordHTML = () => {
    if (!passwordState) {
      return <Warning>密碼不完整</Warning>;
    } else if (!passwordAuthState) {
      return <Warning>密碼錯誤</Warning>;
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

        <LoginButton onClick={(e) => handleLogin()} data-testid="loginButton">
          登入
        </LoginButton>
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
  left: 80px;
  color: red;
  @media (max-width: 414px) {
    left: 70px;
  }
  @media (max-width: 375px) {
    left: 60px;
  }
`;

const LoginButton = styled.button`
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
