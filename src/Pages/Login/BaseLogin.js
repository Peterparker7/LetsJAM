import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { newUser } from "../../utils/firebase";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Login from "./Login";
import Register from "./Register";

function BaseLogin() {
  const [toggle, setToggle] = useState(true);

  const baseHTML = () => {
    if (toggle) {
      return <div>{Login()}</div>;
    } else {
      <div>{Register()}</div>;
    }
  };

  return (
    <div>
      <Container>
        <SelectContainer>
          <SelectTag
            disabled={!toggle}
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            註冊會員
          </SelectTag>
          <SelectTag
            disabled={toggle}
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            會員登入
          </SelectTag>
        </SelectContainer>
        <div>{baseHTML()}</div>
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 600px;
  margin: 0 auto;
  border: 1px solid #979797;
`;
const SelectContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
`;
const SelectTag = styled.div``;

export default BaseLogin;
