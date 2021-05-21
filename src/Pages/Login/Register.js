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

  const [emailValue, setEmailValue] = useState();
  const [passwordValue, setPasswordValue] = useState();
  const [userInfoValue, setUserInfoValue] = useState({
    name: "",
    preferType: "",
  });

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
    setEmailValue(e);
    console.log(userEmail);
  };
  const handlePasswordChange = (e) => {
    console.log(e);
    userPassword = e;
    setPasswordValue(e);
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
          return result.user.uid;
        })
        .then((uid) => {
          newUser(userEmail, uid, userInfo);
        })
        .then(() => {
          alert("註冊成功！正在重新導向");
          window.location.href = "./";
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
    setUserInfoValue({ ...userInfoValue, [type]: e });
  };

  console.log(userInfoValue);
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
    }
    if (!userInfoValue.name) {
      setNameState(false);
      return false;
    } else if (userInfoValue.name) {
      setNameState(true);
    }
    if (!userInfoValue.preferType) {
      setPreferTypeState(false);
      return false;
    } else if (userInfoValue.preferType) {
      setPreferTypeState(true);
    }
    if (skillArray.length === 0) {
      setSkillState(false);
      return false;
    } else if (skillArray.length !== 0) {
      setSkillState(true);
      return true;
    }
  };
  const registerHTML = () => {
    return (
      <div>
        <ItemField>
          <RequireField>*</RequireField>
          <Label for="email">電子信箱</Label>
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
          <Warning
            style={
              emailState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </Warning>
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="password">設定密碼</Label>
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
          <Warning
            style={
              passwordState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </Warning>
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="name">名稱</Label>
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
          <Warning
            style={
              nameState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </Warning>
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="preferType">偏好類型</Label>
          <SelectPreferType
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
          </SelectPreferType>
          <Warning
            style={
              preferTypeState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </Warning>
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="skill">會的樂器</Label>
          <SkillSelectDiv>
            <MultiSelect
              id="skill"
              options={options}
              value={skill}
              onChange={setSkill}
              labelledBy="Select"
            />
          </SkillSelectDiv>
          <Warning
            style={
              skillState
                ? { display: "none" }
                : { display: "inline-block", color: "red" }
            }
          >
            此項必填
          </Warning>
        </ItemField>
        <RegisterButton onClick={() => handleRegister()}>
          馬上加入
        </RegisterButton>
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

const ItemField = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: inline-block;
  width: 80px;
`;

const InputField = styled.input`
  border: 1px solid #979797;
  padding: 5px;
  width: 250px;
  height: 38px;
`;
const Warning = styled.div`
  width: 80px;
  font-size: 12px;
`;

const SelectPreferType = styled.select`
  width: 250px;
  padding: 5px;
`;

const SkillSelectDiv = styled.div`
  width: 250px;
`;

const RequireField = styled.span`
  color: red;
`;
const RegisterButton = styled.button`
  width: 90px;
  margin: 0 auto;
  height: 40px;
  border: 1px solid #979797;
  margin-top: 30px;
  margin-bottom: 30px;
`;
export default Register;
