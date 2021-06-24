import "../../App.css";
import "./swal2.css";
import firebase from "firebase/app";
import "firebase/auth";
import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newUser } from "../../utils/firebase";
import MultiSelect from "react-multi-select-component";
import Swal from "sweetalert2";
import * as LoginValidate from "./LoginValidate";
import { SelectTypeWhiteRegisterHTML } from "../../Components/SelectComponent";

const StyledMultiSelect = styled(MultiSelect)`
  border: 1px solid #b7b7b7;
  --rmsc-border: unset !important;
  --rmsc-h: 38px !important;
  --rmsc-p: 5px !important;
  --rmsc-bg: #f8f8ff;
  --rmsc-selected: #43ede8a6;

  --rmsc-main: none;
  width: 250px;
  text-align: left;
  .dropdown-heading {
    padding-left: 5px;
  }
  .dropdown-content {
  }
  .item-renderer {
    padding: 10px 5px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
  }
`;

let userInfo = {};

function Register(props) {
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
    { label: "電吉他", value: "電吉他" },
    { label: "貝斯", value: "貝斯" },
    { label: "鍵盤", value: "鍵盤" },
    { label: "爵士鼓", value: "爵士鼓" },
    { label: "直笛", value: "直笛" },
  ];

  let skillArray = [];
  skill.forEach((data) => {
    skillArray.push(data.value);
  });

  const handleEmailChange = (e) => {
    setEmailValue(e);
  };
  const handlePasswordChange = (e) => {
    setPasswordValue(e);
  };

  const handleRegister = () => {
    userInfo = { ...userInfo, skill: skillArray };

    if (formCheck()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailValue, passwordValue)
        .then((result) => {
          return result.user.uid;
        })
        .then(async (uid) => {
          //這裡沒用await的話userData會來不及寫入
          await newUser(emailValue, uid, userInfo);
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
          history.push("/");
        })
        .catch((error) => {
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
    setUserInfoValue({ ...userInfoValue, [type]: e });
  };

  const WarningHTML = () => {
    setWarningDisplay(true);
  };

  const formCheck = () => {
    WarningHTML();
    let emailRule =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
      return false;
    } else {
      return true;
    }
  };
  const registerHTML = () => {
    return (
      <Container>
        <ItemField>
          <RequireField>*</RequireField>
          <Label htmlFor="email">電子信箱</Label>
          <InputField
            id="email"
            placeholder="example@gmail.com"
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
          ></InputField>
          {LoginValidate.warningEmailHTML(emailValue, warningDisplay)}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label htmlFor="password">設定密碼</Label>
          <InputField
            placeholder="密碼長度至少6碼"
            id="password"
            type="password"
            onChange={(e) => {
              handlePasswordChange(e.target.value);
            }}
          ></InputField>
          {LoginValidate.warningPasswordHTML(passwordValue, warningDisplay)}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label htmlFor="name">用戶名稱</Label>
          <InputField
            id="name"
            placeholder="例: 小明"
            onChange={(e) => {
              handleChange(e.target.value, "name");
            }}
            data-testid="registerInputName"
          ></InputField>
          {LoginValidate.warningNameHTML(userInfoValue.name, warningDisplay)}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label htmlFor="preferType">偏好類型</Label>
          <SelectTypeWhiteRegisterHTML handleChange={handleChange} />
          {LoginValidate.warningTypeHTML(
            userInfoValue.preferType,
            warningDisplay
          )}
        </ItemField>
        <ItemField>
          <RequireField>*</RequireField>

          <Label htmlFor="skill">會的樂器</Label>
          <SkillSelectDiv>
            <StyledMultiSelect
              id="skill"
              options={options}
              disableSearch={true}
              overrideStrings={override}
              value={skill}
              onChange={setSkill}
              labelledBy="Select"
            />
          </SkillSelectDiv>

          {LoginValidate.warningSkillHTML(skill, warningDisplay)}
        </ItemField>
        <RegisterButton
          onClick={() => handleRegister()}
          data-testid="registerButton"
        >
          馬上加入
        </RegisterButton>
      </Container>
    );
  };

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
  ::placeholder {
    color: #aaa;
  }
  @media (max-width: 576px) {
    max-width: 70%;
  }
  @media (max-width: 414px) {
    max-width: 60%;
  }
`;

const SkillSelectDiv = styled.div`
  width: 250px;
  @media (max-width: 576px) {
    max-width: 70%;
  }
  @media (max-width: 414px) {
    max-width: 60%;
  }
`;

const RequireField = styled.span`
  color: red;
`;
const RegisterButton = styled.button`
  margin: 0 auto;
  font-weight: 500;
  padding: 12px 40px;
  border: 1px solid none;
  border-radius: 8px;
  margin-top: 30px;
  margin-bottom: 30px;
  background: #121212;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.85;

    color: white;
    transform: translateY(-2px);
  }
`;
export default Register;
