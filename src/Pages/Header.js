import "../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import iconTaylorBlack from "../images/icon-Taylor-black.png";
import iconLifelogoWhite from "../images/icon-LifelogoEasy-white.png";
import iconPersonCircle from "../images/person-circle.svg";
import menuIcon from "../images/list.svg";
// import { useParams } from "react-router-dom";
import { getUserData, getAuthUser } from "../utils/firebase";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

function Header() {
  const [userData, setUserData] = useState([]);
  const [sideBarDisplay, setSideBarDisplay] = useState(false);
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

  const handleMenuSideBar = () => {
    setSideBarDisplay(!sideBarDisplay);
  };
  const showMenuSideBar = () => {
    const menuCreateHTML = () => {
      if (userDataRedux.length !== 0) {
        return (
          <StyledLink to={`/activities/create`}>
            <Item>我要開團</Item>
          </StyledLink>
        );
      } else {
        return (
          <StyledLink to={`/activities/login`}>
            <Item
              onClick={() => {
                alert("登入以使用開團功能");
              }}
            >
              我要開團
            </Item>
          </StyledLink>
        );
      }
    };

    const menuLoginHTML = () => {
      if (userDataRedux.length !== 0) {
        return (
          <SideBarProfileContainer>
            <StyledLink to={`/activities/profile`}>
              <SideBarIconUser
                style={{
                  background: `url(${userDataRedux.profileImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "",
                }}
              ></SideBarIconUser>
            </StyledLink>
            <StyledLink to={`/activities/profile`}>
              <Item>{userDataRedux.name}</Item>
            </StyledLink>
          </SideBarProfileContainer>
        );
      } else {
        return (
          <SideBarProfileContainer>
            <StyledLink to={`/activities/login`}>
              <SideBarIconDefault src={iconPersonCircle} alt="" />
            </StyledLink>
            <StyledLink to={`/activities/login`}>
              <Item>登入/註冊</Item>
            </StyledLink>
          </SideBarProfileContainer>
        );
      }
    };

    if (sideBarDisplay) {
      console.log(sideBarDisplay);
      return (
        <MenuSideBar>
          <MenuItem>{menuLoginHTML()}</MenuItem>
          <MenuSideBarItem>成果牆</MenuSideBarItem>
          {menuCreateHTML()}
        </MenuSideBar>
      );
    } else {
      console.log(sideBarDisplay);

      return;
    }
  };

  const handleCreateHTML = () => {
    if (userData.length !== 0) {
      return (
        <StyledLink to={`/activities/create`}>
          <Item>我要開團</Item>
        </StyledLink>
      );
    } else {
      return (
        <StyledLink to={`/activities/login`}>
          <Item
            onClick={() => {
              alert("登入以使用開團功能");
            }}
          >
            我要開團
          </Item>
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
            <IconUser src={userDataRedux.profileImage} alt="" />
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
      <IconContainer>
        <StyledLink to={`/`}>
          <IconImage src={iconTaylorBlack} alt="" />
          {/* <IconImage src={iconLifelogoWhite} alt="" /> */}
        </StyledLink>
      </IconContainer>
      <NavItem>
        <Item>成果牆</Item>
        {handleCreateHTML()}
        {handleLoginHTML()}
      </NavItem>
      <NavMenu>
        <MenuIcon src={menuIcon} alt="" onClick={() => handleMenuSideBar()} />
        {showMenuSideBar()}
      </NavMenu>
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
  height: 80px;
  display: flex;
  padding: 0 40px;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;
const IconContainer = styled.div`
  @media (max-width: 768px) {
    margin: 0 auto;
  }
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
  @media (max-width: 768px) {
    display: none;
  }
`;
const NavMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;
const MenuIcon = styled.img`
  width: 40px;
  height: 40px;
`;
const MenuSideBar = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  display: none;
  background: #000;
  color: #fff;
  z-index: 2;
  padding: 40px;
  text-align: left;
  line-height: 50px;
  align-items: center;
  @media (max-width: 768px) {
    display: block;
  }
`;
const MenuSideBarItem = styled.div`
  margin-left: 30px;
`;
const MenuItem = styled.div``;
const SideBarProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const SideBarIconDefault = styled.img`
  width: 80px;
  height: 80px;
  margin-left: 70px;
`;
const SideBarIconUser = styled.div`
  width: 80px;
  height: 80px;
  margin-left: 70px;
  border-radius: 50%;
  background-position: 50% 50%;
`;
const Item = styled.div`
  /* width: 90px; */
  margin-right: 5px;
  margin-left: 30px;
  color: #fff;
`;

const SignInItem = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.img`
  width: 60px;
`;

export default Header;
