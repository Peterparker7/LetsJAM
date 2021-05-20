import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { newUser } from "../../utils/firebase";
import MultiSelect from "react-multi-select-component";

// Initialize Firebase
const db = window.firebase.firestore();
let userEmail = "";
let userPassword = "";
let userInfo = {};

function Register() {
  const [emailState, setEmailState] = useState(true);
  const [passwordState, setPasswordState] = useState(true);
  const [nameState, setNameState] = useState(true);
  const [preferTypeState, setPreferTypeState] = useState(true);
  const [skillState, setSkillState] = useState(true);

  const [skill, setSkill] = useState([]);
  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
  ];

  let skillArray = [];
  skill.forEach((data) => {
    skillArray.push(data.value);
  });

  const handleEmailChange = (e) => {
    console.log(e);
    userEmail = e;
    console.log(userEmail);
  };
  const handlePasswordChange = (e) => {
    console.log(e);
    userPassword = e;
  };

  const handleRegister = () => {
    userInfo = { ...userInfo, skill: skillArray };

    if (formCheck()) {
      console.log("pass");
      //     //註冊
      window.firebase
        .auth()
        .createUserWithEmailAndPassword(userEmail, userPassword)
        .then((result) => {
          console.log("register firebase");
          console.log(result.user.uid);
          console.log(userInfo);
          console.log(userEmail);
          return result.user.uid;
        })
        .then((uid) => {
          newUser(userEmail, uid, userInfo);
        })
        .then(() => {
          alert("註冊成功！正在重新導向");
          //   window.location.href = "./";
        })
        .catch((error) => {
          alert(error.message);
          console.log(error.message);
        });
    }
  };

  const handleChange = (e, type) => {
    userInfo = {
      ...userInfo,
      [type]: e,
    };
    // formCheck();
  };

  console.log(userInfo);
  console.log(userEmail);
  console.log(userPassword);

  const formCheck = () => {
    // userInfo = { ...userInfo, skill: skillArray };

    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let name = document.querySelector("#name");
    let preferType = document.querySelector("#preferType");

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
    }
    if (!name.value) {
      setNameState(false);
      return false;
    } else if (name.value) {
      setNameState(true);
    }
    if (!preferType.value) {
      setPreferTypeState(false);
      return false;
    } else if (preferType.value) {
      setPreferTypeState(true);
    }
    if (skillArray.length === 0) {
      setSkillState(false);
      return false;
    } else if (skillArray.length !== 0) {
      setSkillState(true);
      return true;
    }

    console.log(preferType.value);
    console.log(skillArray.length);
  };
  const registerHTML = () => {
    return (
      <div>
        <div>
          <RequireField>*</RequireField>
          <label for="email">電子信箱</label>
          <InputField
            id="email"
            placeholder="example@gmail.com"
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
            style={
              emailState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
          ></InputField>
          <div
            style={
              emailState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </div>
        </div>
        <div>
          <RequireField>*</RequireField>

          <label for="password">設定密碼</label>
          <InputField
            placeholder="密碼長度至少6碼"
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
          <div
            style={
              passwordState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </div>
        </div>
        <div>
          <RequireField>*</RequireField>

          <label for="name">名稱</label>
          <InputField
            id="name"
            style={
              nameState
                ? { border: "1px solid #979797" }
                : { border: "1px solid red" }
            }
            onChange={(e) => {
              handleChange(e.target.value, "name");
            }}
          ></InputField>
          <div
            style={
              nameState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </div>
          <div></div>
        </div>
        <div>
          <RequireField>*</RequireField>

          <label for="preferType">偏好類型</label>
          <select
            id="preferType"
            onChange={(e) => {
              handleChange(e.target.value, "preferType");
            }}
          >
            <option value="" disabled selected>
              請選擇
            </option>
            <option>流行</option>
            <option>嘻哈</option>
            <option>古典</option>
          </select>
          <span
            style={
              preferTypeState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </span>
        </div>
        <SkillDiv>
          <RequireField>*</RequireField>

          <label for="skill">會的樂器</label>
          <SkillSelectDiv>
            <MultiSelect
              id="skill"
              options={options}
              value={skill}
              onChange={() => {
                setSkill();
              }}
              labelledBy="Select"
            />
          </SkillSelectDiv>
          <span
            style={
              skillState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </span>
        </SkillDiv>
        <button onClick={() => handleRegister()}>註冊</button>
      </div>
    );
  };
  //     //註冊
  // firebase.auth().createUserWithEmailAndPassword(email, password)
  // .then(() => {
  //     ...
  // })
  // .catch((error) => {
  //     console.log(error.message);
  // });

  // //登入
  // firebase.auth().signInWithEmailAndPassword(email, password)
  // .then(() => {
  //     ...
  // })
  // .catch((error) => {
  //   console.log(error.message);
  // });

  return (
    <div>
      <div>{registerHTML()}</div>
    </div>
  );
}

const InputField = styled.input`
  border: 1px solid #979797;
`;

const SkillDiv = styled.div`
  display: flex;
  width: 480px;
  margin: 0 auto;
`;

const SkillSelectDiv = styled.div`
  width: 300px;
`;

const RequireField = styled.span`
  color: red;
`;

export default Register;
