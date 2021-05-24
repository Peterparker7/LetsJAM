import "../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import iconTaylorBlack from "../images/icon-Taylor-black.png";
import iconLifelogoWhite from "../images/icon-LifelogoEasy-white.png";
import iconPersonCircle from "../images/person-circle.svg";
// import { useParams } from "react-router-dom";
import { getUserData, getAuthUser } from "../utils/firebase";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

function Header() {
  const [userData, setUserData] = useState([]);
  const userDataRedux = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    console.log(userUid);
    const data = await getUserData(userUid);
    console.log(data);
    setUserData(data);
    dispatch({ type: "UPDATE_USERDATA", data: data });
  };

  useEffect(() => {
    checkUserIsLogin();
  }, []);

  console.log(userData);
  if (!userData) {
    return "isLoading";
  }
  console.log(userData);

  const handleCreateHTML = () => {
    if (userData.length !== 0) {
      return (
        <StyledLink to={`/activities/create`}>
          <div>我要開團</div>
        </StyledLink>
      );
    } else {
      return (
        <StyledLink to={`/activities/login`}>
          <div
            onClick={() => {
              alert("登入以使用開團功能");
            }}
          >
            我要開團
          </div>
        </StyledLink>
      );
    }
  };

  const handleLoginHTML = () => {
    if (userData.length !== 0) {
      return (
        <SignInItem>
          <StyledLink to={`/activities/profile`}>
            <Item>{userDataRedux.name}</Item>
          </StyledLink>
          <StyledLink to={`/activities/profile`}>
            <IconUser src={iconPersonCircle} alt="" />
          </StyledLink>
        </SignInItem>
      );
    } else {
      return (
        <SignInItem>
          <Item>
            <StyledLink to={`/activities/login`}>
              <div>登入/註冊</div>
            </StyledLink>
          </Item>
          <StyledLink to={`/activities/login`}>
            <IconUser src={iconPersonCircle} alt="" />
          </StyledLink>
        </SignInItem>
      );
    }
  };

  return (
    <HeaderContainer>
      <div>
        <StyledLink to={`/`}>
          <IconImage src={iconTaylorBlack} alt="" />
          {/* <IconImage src={iconLifelogoWhite} alt="" /> */}
        </StyledLink>
      </div>
      <NavItem>
        <Item>成果牆</Item>
        <Item>{handleCreateHTML()}</Item>
        {handleLoginHTML()}
      </NavItem>
    </HeaderContainer>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  align-items: center;

  /* &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  } */
`;
const HeaderContainer = styled.header`
  width: 100%;
  height: 100px;
  display: flex;
  padding: 0 40px;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

const IconImage = styled.img`
  width: 140px;
`;

const IconUser = styled.img`
  width: 30px;
  margin-left: 10px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
`;

const Item = styled.div`
  /* width: 90px; */
  margin-right: 5px;
  margin-left: 30px;
`;

const SignInItem = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.img`
  width: 60px;
`;

export default Header;
