import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

function BaseLogin() {
  const [toggle, setToggle] = useState(true);

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
  height: 70vh;
`;
const Container = styled.div`
  width: 600px;
  margin: 50px auto;
  border: 1px solid #979797;
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
