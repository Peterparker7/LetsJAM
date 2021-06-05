import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { getAuthUser } from "../../utils/firebase";
import iconTaylorBlack from "../../images/icon-Taylor-black.png";

import Login from "./Login";
import Register from "./Register";
import { useSelector, useDispatch } from "react-redux";

function BaseLogin(props) {
  const [toggle, setToggle] = useState(true);
  // const [userUid, setUserUid] = useState();
  const userDataRedux = useSelector((state) => state.userData);
  let history = useHistory();

  console.log(props.userUid);
  // if (props.userUid) {
  //   history.push("/");
  //   return "redirection";
  // }

  if (props.userUid === "") {
    return null;
  } else if (props.userUid) {
    history.push("/");
    return "redirection";
  }

  // if (userDataRedux.length !== 0) {
  //   // window.location.href = "/";
  //   history.push("/");
  //   return "redirection";
  // }

  const baseHTML = () => {
    if (toggle) {
      console.log(toggle);
      return (
        <div>
          <Login />
        </div>
      );
    } else {
      console.log(toggle);

      return (
        <div>
          <Register />
        </div>
      );
    }
  };

  return (
    <PageContainer>
      <LogoContainer>
        <Logo src={iconTaylorBlack}></Logo>
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
                    borderBottom: "1px solid #979797",
                    borderRight: "1px solid #979797",
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
                    borderBottom: "1px solid #979797",
                    borderLeft: "1px solid #979797",
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
  /* height: ; */
  min-height: calc(100vh - 180px);
  border: 1px solid #979797;
  width: 100%;
  background: white;

  margin: auto;
`;
const LogoContainer = styled.div`
  max-width: 600px;
  margin: 40px auto 0px;
  position: relative;
`;
const Logo = styled.img`
  width: 100%;
`;
const Slogan = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 24px;
  font-weight: 700;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 30px auto 100px;
  border: 1px solid #979797;
  background: white;
  border-radius: 4px;
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
`;

const FormDetail = styled.div`
  margin: 0 auto;
  margin-top: 40px;
  width: 400px;
  justify-content: space-between;
`;

export default BaseLogin;
