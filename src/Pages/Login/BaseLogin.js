import "../../App.css";
import styled from "styled-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import iconTaylorWhite from "../../images/icon-Taylor-white.png";

import Login from "./Login";
import Register from "./Register";
import concert2 from "../../images/concert2.jpg";
import IsLoading from "../../Components/IsLoading";

function BaseLogin(props) {
  const [toggle, setToggle] = useState(true);

  let history = useHistory();

  if (props.userUid === "") {
    return <IsLoading loadingStyle={"normal"} size={40} />;
  } else if (props.userUid) {
    history.push("/");
    return "redirection";
  }

  const baseHTML = () => {
    if (toggle) {
      return (
        <div>
          <Login props={props} />
        </div>
      );
    } else {
      return (
        <div>
          <Register props={props} />
        </div>
      );
    }
  };

  return (
    <PageContainer>
      <LogoContainer>
        <Logo src={iconTaylorWhite}></Logo>
        <Slogan>-最懂你的音樂夥伴</Slogan>
      </LogoContainer>

      <Container>
        <SelectContainer>
          <SelectTag
            disabled={!toggle}
            onClick={() => {
              setToggle(!toggle);
            }}
            style={
              toggle
                ? {
                    borderBottom: "1px solid #b7b7b7",
                    borderRight: "1px solid #b7b7b7",
                  }
                : { borderBottom: "none" }
            }
          >
            註冊會員
          </SelectTag>
          <SelectTag
            disabled={toggle}
            onClick={() => {
              setToggle(!toggle);
            }}
            style={
              toggle
                ? { borderBottom: "none" }
                : {
                    borderBottom: "1px solid #b7b7b7",
                    borderLeft: "1px solid #b7b7b7",
                  }
            }
          >
            會員登入
          </SelectTag>
        </SelectContainer>
        <FormDetail>{baseHTML()}</FormDetail>
      </Container>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 980px;
  width: 100%;
  background: #f8f8ff;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2)),
    url(${concert2});
  background-size: cover;
  background-position: 50% 50%;
  margin: auto;
  padding-bottom: 20px;
  padding-top: 20px;
`;
const LogoContainer = styled.div`
  max-width: 600px;
  margin: 40px auto 0px;
  padding: 10px;
  position: relative;
  @media (max-width: 576px) {
    width: 90%;
    margin-top: 10px;
  }
`;

const Logo = styled.img`
  width: 100%;
`;
const Slogan = styled.div`
  position: absolute;
  color: white;
  right: 20px;
  bottom: 20px;
  font-size: 24px;
  font-weight: 700;
  @media (max-width: 576px) {
    bottom: 0px;
  }
  @media (max-width: 414px) {
    font-size: 20px;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 30px auto 100px;
  border: 1px solid #b7b7b7;
  background: #f8f8ff;
  border-radius: 4px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
  }
`;
const SelectContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
`;
const SelectTag = styled.button`
  width: 300px;
  padding-top: 20px;
  padding-bottom: 20px;
  color: #2f2f2f;
  cursor: pointer;
`;

const FormDetail = styled.div`
  margin: 0 auto;
  margin-top: 40px;
  width: 400px;
  justify-content: space-between;
  @media (max-width: 576px) {
    width: 80%;
  }
`;

export default BaseLogin;
