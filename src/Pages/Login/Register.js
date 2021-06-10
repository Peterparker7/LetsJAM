import "../../App.css";
import "./swal2.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { newUser } from "../../utils/firebase";
import MultiSelect from "react-multi-select-component";
import Swal from "sweetalert2";
import * as LoginValidate from "./LoginValidate";

const StyledMultiSelect = styled(MultiSelect)`
  border: 1px solid #b7b7b7;
  --rmsc-border: unset !important;
  --rmsc-h: 38px !important;
  --rmsc-p: 5px !important;
  width: 250px;
  text-align: left;
  @media (max-width: 576px) {
    max-width: 100%;
  }
`;
// Initialize Firebase
const db = window.firebase.firestore();
let userEmail = "";
let userPassword = "";
let userInfo = {};

function Register(props) {
  const [emailState, setEmailState] = useState(true);
  const [passwordState, setPasswordState] = useState(true);
  const [nameState, setNameState] = useState(true);
  const [preferTypeState, setPreferTypeState] = useState(true);
  const [skillState, setSkillState] = useState(true);

  let history = useHistory();

  const [warningDisplay, setWarningDisplay] = useState(false);

  const [emailValue, setEmailValue] = useState();
  const [passwordValue, setPasswordValue] = useState();
  const [userInfoValue, setUserInfoValue] = useState({
    name: "",
    preferType: "",
  });

  const [skill, setSkill] = useState([]);
  let override = {
    allItemsAreSelected: "我全都會",
    clearSearch: "Clear Search",
    noOptions: "No options",
    search: "搜尋",
    selectAll: "全選",
    selectSomeItems: "請選擇樂器",
  };
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
        .then(async (uid) => {
          //這裡沒用await的話userData會來不及寫入
          let create = await newUser(userEmail, uid, userInfo);
          props.props.setIsLogIn(true);
        })
        .then(() => {
          Swal.fire({
            title:
              "<span style=font-size:24px>註冊成功！歡迎使用Let's JAM！</span>",
            customClass: "customSwal2Title",
            background: "black",
            showConfirmButton: false,
            timer: 2000,
          });
          // alert("註冊成功！正在重新導向");
          history.push("/");

          // window.location.href = "./";
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/email-already-in-use")
            Swal.fire({
              title: "<span style=font-size:24px>此信箱已經註冊過囉</span>",
              customClass: "customSwal2Title",
              background: "black",
              confirmButtonColor: "#43e8d8",
              confirmButtonText: "<span  style=color:#000>確定</span",
            });
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

  const WarningHTML = () => {
    setWarningDisplay(true);
  };

  const formCheck = () => {
    // userInfo = { ...userInfo, skill: skillArray };
    WarningHTML();
    let emailRule =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !emailValue ||
      emailValue.search(emailRule) === -1 ||
      emailValue.length > 32 ||
      !passwordValue ||
      passwordValue.length < 6 ||
      !userInfoValue.name ||
      userInfoValue.name.length > 10 ||
      !userInfoValue.preferType ||
      skill.length === 0
    ) {
      console.log("not pass");
      return false;
    } else {
      return true;
    }

    //原本加外框的判斷
    // if (!emailValue) {
    //   setEmailState(false);
    //   return false;
    // } else if (emailValue) {
    //   setEmailState(true);
    // }
    // if (!passwordValue) {
    //   setPasswordState(false);
    //   return false;
    // } else if (passwordValue) {
    //   setPasswordState(true);
    // }
    // if (!userInfoValue.name) {
    //   setNameState(false);
    //   return false;
    // } else if (userInfoValue.name) {
    //   setNameState(true);
    // }
    // if (!userInfoValue.preferType) {
    //   setPreferTypeState(false);
    //   return false;
    // } else if (userInfoValue.preferType) {
    //   setPreferTypeState(true);
    // }
    // if (skillArray.length === 0) {
    //   setSkillState(false);
    //   return false;
    // } else if (skillArray.length !== 0) {
    //   setSkillState(true);
    //   return true;
    // }
  };
  const registerHTML = () => {
    return (
      <Container>
        <ItemField>
          <RequireField>*</RequireField>
          <Label for="email">電子信箱</Label>
          <InputField
            id="email"
            placeholder="example@gmail.com"
            onChange={(e) => {
              handleEmailChange(e.target.value);
              // setWarningDisplay(false);
            }}
            style={
              emailState
                ? { border: "1px solid #b7b7b7" }
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
          {LoginValidate.warningEmailHTML(emailValue, warningDisplay)}
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
                ? { border: "1px solid #b7b7b7" }
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
          {LoginValidate.warningPasswordHTML(passwordValue, warningDisplay)}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="name">用戶名稱</Label>
          <InputField
            id="name"
            placeholder="例: 小明"
            style={
              nameState
                ? { border: "1px solid #b7b7b7" }
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
          {LoginValidate.warningNameHTML(userInfoValue.name, warningDisplay)}
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
          {LoginValidate.warningTypeHTML(
            userInfoValue.preferType,
            warningDisplay
          )}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label for="skill">會的樂器</Label>
          <SkillSelectDiv>
            <StyledMultiSelect
              id="skill"
              options={options}
              overrideStrings={override}
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
          {LoginValidate.warningSkillHTML(skill, warningDisplay)}
        </ItemField>
        <RegisterButton onClick={() => handleRegister()}>
          馬上加入
        </RegisterButton>
      </Container>
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
const Container = styled.div`
  margin: 0 10px;
`;
const ItemField = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0 30px 0;
  position: relative;
  color: #2f2f2f;
`;
const Label = styled.label`
  display: inline-block;
  width: 80px;
`;

const InputField = styled.input`
  border: 1px solid #b7b7b7;
  padding: 5px;
  width: 250px;
  height: 38px;
  @media (max-width: 576px) {
    max-width: 60%;
  }
`;
const Warning = styled.div`
  width: 80px;
  font-size: 12px;
`;

const SelectPreferType = styled.select`
  width: 250px;
  padding: 5px;
  @media (max-width: 576px) {
    max-width: 60%;
  }
`;

const SkillSelectDiv = styled.div`
  width: 250px;
  @media (max-width: 576px) {
    max-width: 60%;
  }
`;

const RequireField = styled.span`
  color: red;
`;
const RegisterButton = styled.button`
  /* width: 90px; */
  margin: 0 auto;
  font-weight: 500;
  padding: 12px 40px;
  /* height: 40px; */
  border: 1px solid none;
  border-radius: 8px;
  margin-top: 30px;
  margin-bottom: 30px;
  background: #121212;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  /* opacity: 0.7; */
  &:hover {
    opacity: 0.85;

    color: white;
    transform: translateY(-2px);
  }
`;
export default Register;
