import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import error404 from "../images/404-error.svg";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  background: #121212;
  height: 100vh;
  padding-top: 100px;
`;
const ErrorIconContainer = styled.div`
  width: 250px;
  height: 250px;
  margin: 0px auto;
  align-items: center;
`;

const ErrorIcon = styled.img`
  width: 100%;
`;
const ErrorText = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;
const ButtonField = styled.div`
  margin: 20px auto;
  width: 200px;
  text-align: center;
`;
const MainPageBtn = styled.button`
  padding: 12px 40px;
  background: #43e8d8;
  border-radius: 8px;
  color: black;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  background: #43e8d8;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #4cffee;
    transform: translateY(-2px);
    box-shadow: 0 0 20px #43e8d8;
  }
`;
export default function Error404() {
  const history = useHistory();

  function backToHome() {
    history.push("/");
  }
  return (
    <Container>
      <ErrorIconContainer>
        <ErrorIcon src={error404} alt="" />
      </ErrorIconContainer>
      <ErrorText>Oops~ 找不到此頁</ErrorText>
      <ButtonField>
        <MainPageBtn onClick={backToHome}>回Let's JAM</MainPageBtn>
      </ButtonField>
    </Container>
  );
}
