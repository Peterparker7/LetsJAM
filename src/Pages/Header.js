import "../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import iconTaylorBlack from "../images/icon-Taylor-black.png";
import iconLifelogoWhite from "../images/icon-LifelogoEasy-white.png";
import iconPersonCircle from "../images/person-circle.svg";
import menuIcon from "../images/list.svg";
import mailboxIcon from "../images/envelope.svg";
// import { useParams } from "react-router-dom";
import {
  getUserData,
  getAuthUser,
  getSpecificData,
  subscribeUser,
  updateInvitation,
} from "../utils/firebase";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

function Header() {
  const [userData, setUserData] = useState([]);
  const [invitationData, setInvitationData] = useState([]);
  const [sideBarDisplay, setSideBarDisplay] = useState(false);
  const [mailBoxDisplay, setMailBoxDisplay] = useState(false);
  const [maskDisplay, setMaskDisplay] = useState(false);
  const [userDataChange, setUserDataChange] = useState([]);
  const userDataRedux = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    if (userUid) {
      const data = await getUserData(userUid);
      setUserData(data);
      dispatch({ type: "UPDATE_USERDATA", data: data });
    }
  };

  const handlefirebaseChange = () => {
    console.log(userDataChange);
    setUserData(userDataChange);
  };
  // window.onclick = function (e) {
  //   if (
  //   e.target.id !== "MailBoxDiv" &&
  //   e.target.parentNode.id !== "MailBoxDiv" &&
  //   e.target.offsetParent.id !== "MailBoxDiv" &&
  //   e.target.parentNode.id !== "MailBoxIcon"
  // ) {
  //   setMailBoxDisplay(false);
  // }
  //   console.log(e.currentTarget);
  //   console.log(e);
  // };
  const handleMailbox = () => {
    setMailBoxDisplay(!mailBoxDisplay);
    setMaskDisplay(!maskDisplay);
  };
  const maskClick = () => {
    setMailBoxDisplay(!mailBoxDisplay);
    setMaskDisplay(!maskDisplay);
  };
  const handleIgnore = (activityId) => {
    const newInvitation = userData.invitation.filter(
      (item) => item.id !== activityId
    );
    console.log(newInvitation);
    setUserData({
      ...userData,
      invitation: newInvitation,
    });
    console.log(userData);
    updateInvitation(newInvitation, userDataRedux.uid);
  };
  const handleUserDataChange = () => {};
  const arrangeInvitationData = async () => {
    const invitation = userData.invitation;
    if (!invitation) {
      return "isLoading";
    }
    // 打多次userData, 一次取得多個 attendants 的userData詳細資料，放進detailData 裡面以便之後取用
    const invitedArray = [];
    invitation.forEach((item) => {
      const promise = getSpecificData(item.id).then((data) => {
        console.log(data);
        return data;
      });
      invitedArray.push(promise);
    });
    const allInvitation = await Promise.all(invitedArray);
    setInvitationData(allInvitation);
    console.log(allInvitation);
  };

  useEffect(() => {
    checkUserIsLogin();
  }, []);

  useEffect(() => {
    arrangeInvitationData();
  }, [userData]);

  useEffect(() => {
    subscribeUser(setUserDataChange, userDataRedux.uid);
  }, [userDataRedux]);
  useEffect(() => {
    if (userDataChange) {
      handlefirebaseChange();
    }
  }, [userDataChange]);
  if (!userData) {
    return "isLoading";
  }
  if (!invitationData) {
    return "isLoading";
  }
  // console.log(userDataChange);
  console.log(userData.uid);
  console.log(invitationData);
  const mailboxHTML = () => {
    const invitedActivityHTML = () => {
      if (invitationData.length !== 0) {
        const HTML = invitationData.map((item) => {
          // const messageObj = userData.invitation.filter(
          //   (data) => data.id === item.id
          // );
          if (item) {
            return (
              <Link to={`/activities/${item.id}`}>
                <EachMailDiv
                  style={{
                    background: `url(${item.fileSource})`,
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover",
                  }}
                >
                  <EachMailDivCanvas>
                    <EachMailContent>
                      <EachMailTitle>{item.title}</EachMailTitle>
                      {/* <EachMailMsg>{`${messageObj[0].message}`}</EachMailMsg> */}
                      <IgnoreBtn
                        onClick={() => {
                          handleIgnore(item.id);
                        }}
                      >
                        +
                      </IgnoreBtn>
                    </EachMailContent>
                  </EachMailDivCanvas>
                </EachMailDiv>
              </Link>
            );
          }
        });
        return HTML;
      } else {
        return <NoInvite>無邀請</NoInvite>;
      }
    };

    return (
      <MailBoxDiv
        id="MailBoxDiv"
        style={mailBoxDisplay ? { display: "block" } : { display: "none" }}
      >
        {" "}
        <MailBoxTitle>已收到邀請</MailBoxTitle>
        <MailBoxContainer>{invitedActivityHTML()}</MailBoxContainer>
      </MailBoxDiv>
    );
  };
  const renderMailBoxCircle = () => {
    if (invitationData.length !== 0) {
      return <MailBoxIconCircle></MailBoxIconCircle>;
    } else {
      return;
    }
  };
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
          <MailBoxIconContainer id="MailBoxIcon">
            <MailBoxIcon
              src={mailboxIcon}
              onClick={() => {
                handleMailbox();
              }}
            ></MailBoxIcon>
            {renderMailBoxCircle()}
          </MailBoxIconContainer>
          {mailboxHTML()}
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
      <HeaderDiv>
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
      </HeaderDiv>
      <Mask
        style={maskDisplay ? { display: "block" } : { display: "none" }}
        onClick={() => {
          maskClick();
        }}
      ></Mask>
    </HeaderContainer>
  );
}
const Mask = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  left: 0;
  bottom: 0;
  z-index: 4;
`;
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
  align-items: center;
  justify-content: space-between;
  background-color: white;
  z-index: 5;
`;
const HeaderDiv = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  padding: 0 40px;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  z-index: 5;
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
  z-index: 5;
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
`;

const SignInItem = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.img`
  width: 60px;
`;
const MailBoxIconContainer = styled.div`
  margin-left: 20px;
  position: relative;
  z-index: 5;
`;
const MailBoxIcon = styled.img`
  width: 25px;
`;
const MailBoxIconCircle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff3737;
  bottom: 2px;
  right: -2px;
`;
const MailBoxDiv = styled.div`
  position: absolute;
  width: 400px;
  height: 600px;
  background: white;
  top: 80px;
  right: 0px;
  z-index: 5;
  text-align: left;
`;
const MailBoxTitle = styled.div`
  font-size: 28px;
  margin: 20px;
`;
const MailBoxContainer = styled.div``;
const EachMailDiv = styled.div`
  position: relative;
  width: 100%;
  height: 90px;
  /* margin-left: 20px; */
  border: 1px solid;
`;
const EachMailDivCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 90px;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
`;
const EachMailContent = styled.div`
  padding: 10px 10px;
`;
const EachMailTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;
const EachMailMsg = styled.div`
  font-size: 16px;
  color: white;
`;
const IgnoreBtn = styled.button`
  transform: rotate(0.125turn);
  font-size: 24px;
  color: white;
  position: absolute;
  top: 0;
  right: 0;
`;
const NoInvite = styled.div`
  margin: 0 auto;
  width: 80px;
  font-size: 20px;
`;
export default Header;
