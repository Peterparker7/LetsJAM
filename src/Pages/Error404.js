import styled from "styled-components";
import React from "react";
// import error404 from "../images/404-error.svg";
import { useHistory } from "react-router-dom";
import { keyframes } from "styled-components";

const NeonShine = keyframes`
  0% {opacity: 1}
  10%{opacity:0.7;}
  20%{opacity:1;}
  60%{opacity:1;}
  70%{opacity:0.7;}
  85%{opacity:1;}
  100% {opacity: 1}
`;
const NeonShine2 = keyframes`
  0% {opacity: 1}
1%{opacity:0}
2%{opacity:1}
3%{opacity:0}
4%{opacity:1}
`;
const Container = styled.div`
  width: 100%;
  background: #121212;
  height: 100vh;
  padding-top: 100px;
`;
// const ErrorIconContainer = styled.div`
//   width: 250px;
//   height: 250px;
//   margin: 0px auto;
//   align-items: center;
// `;

// const ErrorIcon = styled.img`
//   width: 100%;
// `;
// const ErrorText = styled.div`
//   color: white;
//   font-size: 24px;
//   font-weight: 700;
//   text-align: center;
// `;
const ButtonField = styled.div`
  margin: 20px auto;
  width: 200px;
  text-align: center;
`;
const MainPageBtn = styled.button`
  margin-top: 20px;
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
const NeonBox = styled.div`
  margin: 0 auto;
  border: 4px solid white;
  width: 350px;
  padding: 20px;
  box-shadow: 0 0 10px #43e8d8, 0 0 20px #43e8d8, inset 0 0 10px #43e8d8,
    inset 0 0 20px #43e8d8;
  animation: ${NeonShine2} 10s 1s linear infinite;
`;
const NeonText = styled.div`
  text-align: center;
  color: white;
  font-size: 36px;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1),
    0 0 60px rgba(255, 65, 65, 1);
  animation: ${NeonShine} 10s 1s linear infinite;
`;

export default function Error404() {
  const history = useHistory();

  function backToHome() {
    history.push("/");
  }
  return (
    <Container>
      {/* <ErrorIconContainer>
        <ErrorIcon src={error404} alt="" />
      </ErrorIconContainer>
      <ErrorText>Oops~ 找不到此頁</ErrorText> */}
      <NeonBox>
        <NeonText>404</NeonText>
        <NeonText>Page Not Found</NeonText>
      </NeonBox>
      <ButtonField>
        <MainPageBtn onClick={backToHome} data-testid="homeButton">
          回Let's JAM
        </MainPageBtn>
      </ButtonField>
    </Container>
  );
}
