import "../App.css";
import styled, { keyframes } from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import iconTaylorBlack from "../images/icon-Taylor-black.png";
import iconTaylorWhite from "../images/icon-Taylor-white.png";
import iconLifelogoWhite from "../images/icon-LifelogoEasy-white.png";
import iconPersonCircle from "../images/person-circle.svg";
import iconPerson from "../images/person-fill.svg";
import menuIcon from "../images/list.svg";
import mailboxIcon from "../images/envelope.svg";
// import { ReactComponent as MailBoxIcon } from "../images/envelope.svg";
// import { useParams } from "react-router-dom";
import {
  getUserData,
  getAuthUser,
  getSpecificData,
  subscribeUser,
  updateInvitation,
} from "../utils/firebase";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Animated } from "react-animated-css";
import Swal from "sweetalert2";

import xIcon from "../images/x.svg";

function Header(props) {
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
    } else {
      //沒有usedUid要把userData設回空的不然會留著之前的state
      setUserData([]);
    }
  };

  const handlefirebaseChange = () => {
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
    setUserData({
      ...userData,
      invitation: newInvitation,
    });
    updateInvitation(newInvitation, userDataRedux.uid);
  };
  const handleGallery = () => {
    Swal.fire({
      title: "<span style=font-size:24px>敬請期待！</span>",
      customClass: "customSwal2Title",
      background: "black",
      showConfirmButton: false,
      timer: 1500,
    });
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
        return data;
      });
      invitedArray.push(promise);
    });
    const allInvitation = await Promise.all(invitedArray);
    setInvitationData(allInvitation);
  };

  useEffect(() => {
    checkUserIsLogin();
  }, [props.userUid]);

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
  const mailboxHTML = () => {
    const invitedActivityHTML = () => {
      if (invitationData.length !== 0) {
        const HTML = invitationData.map((item) => {
          // const messageObj = userData.invitation.filter(
          //   (data) => data.id === item.id
          // );
          if (item) {
            return (
              <EachMailField>
                <Link to={`/activities/${item.id}`}>
                  <EachMailDiv
                    onClick={() => {
                      maskClick();
                    }}
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
                      </EachMailContent>
                    </EachMailDivCanvas>
                  </EachMailDiv>
                </Link>
                <IgnoreBtn
                  onClick={() => {
                    handleIgnore(item.id);
                  }}
                >
                  +
                </IgnoreBtn>
              </EachMailField>
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
        {/* <Animated
          animationIn="fadeInRightBig"
          animationOut="fadeOutUp"
          isVisible={mailBoxDisplay}
        > */}
        <MailBoxDivWrapper>
          <MailBoxTitle>已收到邀請</MailBoxTitle>
          <MailBoxContainer>{invitedActivityHTML()}</MailBoxContainer>
        </MailBoxDivWrapper>
        {/* </Animated> */}
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
      // if (userDataRedux.length !== 0) {
      if (userData.length !== 0) {
        return (
          <StyledLink to={`/activities/create`}>
            <MenuSideBarItem>我要開團</MenuSideBarItem>
          </StyledLink>
        );
      } else {
        return (
          <StyledLink to={`/activities/login`}>
            <MenuSideBarItem
              onClick={() => {
                Swal.fire({
                  title: "<span style=font-size:24px>登入以使用開團功能</span>",
                  customClass: "customSwal2Title",
                  background: "black",
                  showConfirmButton: false,
                  timer: 2000,
                });
                // alert("登入以使用開團功能");
              }}
            >
              我要開團
            </MenuSideBarItem>
          </StyledLink>
        );
      }
    };

    const menuLoginHTML = () => {
      // if (userDataRedux.length !== 0) {
      if (userData.length !== 0) {
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
              <MenuSideBarItem>{userDataRedux.name}</MenuSideBarItem>
            </StyledLink>
          </SideBarProfileContainer>
        );
      } else {
        return (
          <SideBarProfileContainer>
            <StyledLink to={`/activities/login`}>
              <SideBarIconDefault src={iconPerson} alt="" />
            </StyledLink>
            <StyledLink to={`/activities/login`}>
              <MenuSideBarItem>登入/註冊</MenuSideBarItem>
            </StyledLink>
          </SideBarProfileContainer>
        );
      }
    };

    const menuMailBoxHTML = () => {
      // if (userDataRedux.length !== 0) {
      if (userData.length !== 0) {
        const invitedActivityHTML = () => {
          if (invitationData.length !== 0) {
            const HTML = invitationData.map((item) => {
              // const messageObj = userData.invitation.filter(
              //   (data) => data.id === item.id
              // );
              if (item) {
                return (
                  <EachMailField>
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
                          </EachMailContent>
                        </EachMailDivCanvas>
                      </EachMailDiv>
                    </Link>
                    <IgnoreBtn
                      onClick={() => {
                        handleIgnore(item.id);
                      }}
                    >
                      +
                    </IgnoreBtn>
                  </EachMailField>
                );
              }
            });
            return HTML;
          } else {
            return <NoInvite>無邀請</NoInvite>;
          }
        };
        return (
          <MenuSideBarItemInvite>
            邀請
            {invitedActivityHTML()}
          </MenuSideBarItemInvite>
        );
      } else {
        return;
      }
    };

    if (sideBarDisplay) {
      return (
        <MenuSideBar>
          <CloseIconContainer>
            <CloseIcon
              src={xIcon}
              onClick={() => {
                handleMenuSideBar();
              }}
            />
          </CloseIconContainer>
          <MenuItem>{menuLoginHTML()}</MenuItem>
          <MenuSideBarItem
            onClick={() => {
              handleGallery();
            }}
          >
            成果牆
          </MenuSideBarItem>
          {menuCreateHTML()}
          {/* <MenuSideBarItem>邀請</MenuSideBarItem> */}
          {menuMailBoxHTML()}
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
          <ItemTwo>我要開團</ItemTwo>
        </StyledLink>
      );
    } else {
      return (
        <StyledLink to={`/activities/login`}>
          <ItemTwo
            onClick={() => {
              Swal.fire({
                title: "<span style=font-size:24px>登入以使用開團功能</span>",
                customClass: "customSwal2Title",
                background: "black",
                showConfirmButton: false,
                timer: 1500,
              });
              // alert("登入以使用開團功能");
            }}
          >
            我要開團
          </ItemTwo>
        </StyledLink>
      );
    }
  };

  const handleLoginHTML = () => {
    if (userData.length !== 0) {
      return (
        <SignInItem>
          <StyledLink to={`/activities/profile`}>
            <ItemThree>{userDataRedux.name}</ItemThree>
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
          <StyledLink to={`/activities/login`}>
            <ItemThree>登入/註冊</ItemThree>
          </StyledLink>

          <StyledLink to={`/activities/login`}>
            <IconUser src={iconPerson} alt="" />
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
            <IconImage src={iconTaylorWhite} alt="" />
            {/* <IconImage src={iconLifelogoWhite} alt="" /> */}
          </StyledLink>
        </IconContainer>
        <NavItem>
          <ItemOne
            onClick={() => {
              handleGallery();
            }}
          >
            成果牆
          </ItemOne>
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
  /* position: fixed; */
`;
const HeaderDiv = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  padding: 0 40px;
  align-items: center;
  justify-content: space-between;
  background-color: black;
  z-index: 5;
`;
const IconContainer = styled.div`
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;
const IconImage = styled.img`
  width: 200px;
`;

const IconUser = styled.img`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  object-fit: cover;
  border-radius: 50%;
  transition: 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
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
  cursor: pointer;
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
  margin-left: 10px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  /* text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1); */
`;
const MenuSideBarItemInvite = styled.div`
  margin-left: 10px;
  color: #fff;
  font-weight: bold;
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

const NeonShine = keyframes`
  0% {opacity: 1}
  1%{opacity:0;}
  2%{opacity:1;}
  5%{opacity:1;}
  6%{opacity:0;}
  7%{opacity:1;}
  9%{opacity:0;}
  21%{opacity:1;}
  90% {opacity: 1}
`;
const NeonShineTwo = keyframes`
  0% {opacity: 1}
  2%{opacity:0;}
  4%{opacity:1;}
  90% {opacity: 1}
`;
const NeonShineThree = keyframes`
  0% {opacity: 1}
  10% {opacity: 0.8}
  20% {opacity: 1}
  30% {opacity: 0.9}
  61% {opacity: 1}
  65% {opacity: 1}
  100% {opacity: 1}
`;
const NeonShineCircle = keyframes`
  0% {opacity: 1}
  1%{opacity:0;}
  2%{opacity:1;}
  5%{opacity:1;}
  6%{opacity:0;}
  7%{opacity:1;}
  9%{opacity:0;}
  10%{opacity:1;}
  67% {opacity: 1}
  68% {opacity: 0}
  69% {opacity: 1}
  90% {opacity: 1}
`;
const Item = styled.div`
  /* width: 90px; */
  font-weight: bold;
  margin-right: 5px;
  margin-left: 20px;
  color: #fff;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 0 10px #4cffee, 0 0 40px #4cffee, 0 0 50px #4cffee,
      0 0 60px #4cffee;
  }
`;
const ItemOne = styled(Item)`
  /* text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1); */
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  animation: ${NeonShine} 3s linear infinite;
`;
const ItemTwo = styled(Item)`
  /* text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1); */
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  animation: ${NeonShineTwo} 5s linear infinite;
`;
const ItemThree = styled(Item)`
  /* text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1); */
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  animation: ${NeonShineThree} 5s linear infinite;
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
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;
const MailBoxIcon = styled.img`
  width: 30px;
`;
const MailBoxIconCircle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  /* background-color: #ff3737; */
  background-color: white;
  color: white;
  box-shadow: 0 2px 5px #ff00ff, 0 -2px 5px #ff00ff, 2px 2px 10px #ff00ff,
    2px -2px 10px #ff00ff;
  /* animation: ${NeonShineCircle} 10s linear infinite; */

  bottom: 2px;
  right: -2px;
`;
const MailBoxDiv = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  /* position: absolute;
  width: 400px;
  height: 600px;
  background: white;
  top: 80px;
  right: 0px;
  z-index: 5;
  text-align: left; */
`;
const MailBoxDivWrapper = styled.div`
  position: absolute;
  width: 400px;
  height: 600px;
  background: #121212;
  color: white;
  top: 80px;
  right: 0px;
  z-index: 5;
  text-align: left;
`;
const MailBoxTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin: 20px;
`;
const MailBoxContainer = styled.div``;
const EachMailField = styled.div`
  position: relative;
  width: 100%;
  height: 90px;
`;
const EachMailDiv = styled.div`
  position: relative;
  width: 100%;
  height: 90px;
  /* margin-left: 20px; */
  /* border: 1px solid; */
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
  padding: 10px 20px;
  @media (max-width: 768px) {
    padding: 10px 10px;
  }
`;
const EachMailTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
const EachMailMsg = styled.div`
  font-size: 16px;
  color: white;
`;
const IgnoreBtn = styled.button`
  transform: rotate(0.125turn);
  font-size: 28px;
  color: white;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  cursor: pointer;
  &:hover {
  }
`;
const NoInvite = styled.div`
  margin: 0 auto;
  width: 80px;
  font-size: 20px;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 26px;
  right: 20px;
  z-index: 5;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    background: #2d2d2d;
  }
`;
const CloseIcon = styled.img`
  width: 100%;
  position: absolute;
`;

const Neon = styled.div`
  position: absolute;

  top: 120px;
  left: 120px;
  margin: 0 auto;
  padding: 0 20px;
  transform: translate(-50%, -50%);
  color: #fff;
  text-shadow: 0 0 20px #ff005b;
  &:after {
    position: absolute;

    content: attr(data-text);
    top: 0px;
    left: 0px;

    margin: 0 auto;
    padding: 0 20px;
    z-index: -1;
    color: #ff005b;
    filter: blur(15px);
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fe3a80;
    z-index: -2;
    opacity: 0.5;
    filter: blur(100px);
  }
`;
export default Header;
