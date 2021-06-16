import styled from "styled-components";
import React from "react";

const warningEmailHTML = (email, warningDisplay) => {
  let emailRule =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(
    "🚀 ~ file: LoginValidate.js ~ line 5 ~ warningEmailHTML ~ email",
    email
  );
  if (warningDisplay) {
    if (email) {
      if (email.search(emailRule) !== -1) {
      } else {
        return (
          <Warning style={{ display: "inline-block", color: "red" }}>
            無效的email格式
          </Warning>
        );
      }
      if (email.length > 32) {
        console.log("!!");
        // setStatus(false);
        return (
          <Warning style={{ display: "inline-block", color: "red" }}>
            email太長
          </Warning>
        );
      }
    } else {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          必填
        </Warning>
      );
    }
  }
};

const warningPasswordHTML = (password, warningDisplay) => {
  if (warningDisplay) {
    if (password) {
      if (password.length < 6) {
        return (
          <Warning style={{ display: "inline-block", color: "red" }}>
            密碼長度不夠
          </Warning>
        );
      }
    } else {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          必填
        </Warning>
      );
    }
  }
};
const warningNameHTML = (name, warningDisplay) => {
  console.log(name);
  if (warningDisplay) {
    if (name) {
      if (name.length > 10) {
        return (
          <Warning style={{ display: "inline-block", color: "red" }}>
            名稱最多10字
          </Warning>
        );
      }
    } else {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          必填
        </Warning>
      );
    }
  }
};
const warningTypeHTML = (type, warningDisplay) => {
  console.log(type);
  if (warningDisplay) {
    if (type) {
    } else {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          必填
        </Warning>
      );
    }
  }
};
const warningSkillHTML = (skill, warningDisplay) => {
  console.log(skill);
  console.log(skill.length);
  if (warningDisplay) {
    if (skill.length === 0) {
      return (
        <Warning style={{ display: "inline-block", color: "red" }}>
          必填
        </Warning>
      );
    } else {
    }
  }
};

const Warning = styled.div`
  width: auto;
  font-size: 12px;
  padding-left: 10px;
  position: absolute;
  left: 75px;
  bottom: -15px;
`;

export { warningEmailHTML };
export { warningPasswordHTML };
export { warningNameHTML };
export { warningTypeHTML };
export { warningSkillHTML };
