import "../../App.css";
import "./swal2.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getUserData,
  getAuthUser,
  getUserHostActivities,
  getUserJoinActivities,
  getUserApplyActivities,
  logOut,
  cancelJoinActivities,
} from "../../utils/firebase";

import { ModalProvider, BaseModalBackground } from "styled-react-modal";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import EditProfileButton from "./EditProfileButton.js";
import EditActivitiesButton from "./EditActivitiesButton.js";
import EditActivitiesMemberButton from "./EditActivitiesMemberButton.js";

import amplifierImg from "../../images/amplifier-guitar.jpg";

// import CircularIndeterminate from "../Create/CircularProgress";
import IsLoading from "../../Components/IsLoading";
import Swal from "sweetalert2";
import { Animated } from "react-animated-css";

function Profile(props) {
  // let userId = "vfjMHzp45ckI3o3kqDmO";
  //   let userId = "SM7VM6CFOJOZwIDA6fjB";
  const [userData, setUserData] = useState({});
  const [userActivities, setUserActivities] = useState();
  const [userJoinActivities, setUserJoinActivities] = useState([]);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [toggleJoinFilter, setToggleJoinFilter] = useState(true);
  const userDataRedux = useSelector((state) => state.userData);
  const userHostActivityDataRedux = useSelector(
    (state) => state.userHostActivityData
  );
  const userJoinActivityDataRedux = useSelector(
    (state) => state.userJoinActivityData
  );
  const confirmArray = [];
  const dispatch = useDispatch();
  const history = useHistory();
  //fireauth
  // window.firebase.auth().onAuthStateChanged(function (user) {
  //   if (user) {
  //     // 使用者已登入，可以取得資料
  //     var email = user.email;
  //     var uid = user.uid;
  //   } else {
  //     // 使用者未登入
  //   }
  // });

  const checkUserIsLogin = useCallback(() => {
    const checkingUserIsLogin = async () => {
      const userUid = await getAuthUser();
      const data = await getUserData(userUid);
      dispatch({ type: "UPDATE_USERDATA", data: data });
      setUserData(data);
    };
    checkingUserIsLogin();
  }, [dispatch]);

  // const getUserProfileData = async () => {
  //   const data = await getUserData(userId);
  //   dispatch({ type: "UPDATE_USERDATA", data: data });

  //   setUserData(data);
  // };

  const getUserActivitiesData = useCallback(() => {
    const gettingUserActivitiesData = async () => {
      const data = await getUserHostActivities(userData.uid);
      dispatch({ type: "UPDATE_USERHOSTACTIVITYDATA", data: data });

      const attendActivities = await getUserJoinActivities(userData.uid);

      const applyActivities = await getUserApplyActivities(userData.uid);

      setUserJoinActivities((a) => [...a, ...attendActivities]);
      setUserJoinActivities((a) => [...a, ...applyActivities]);
      dispatch({
        type: "UPDATE_USERJOINACTIVITYDATA",
        data: [...attendActivities, ...applyActivities],
      });

      setUserActivities(data);
    };
    gettingUserActivitiesData();
  }, [dispatch, userData.uid]);

  const renderProfile = () => {
    // let requirementHTML = userDataRedux.skill.map((data) => {
    //   return <span>{data} &nbsp;</span>;
    // });
    let skillArray = userDataRedux.skill;
    let skillArrayDelimiter = skillArray.join(", ");
    return (
      <ProfileDetail>
        <ProfileImg src={`${userDataRedux.profileImage}`} />
        <ProfileTextField>
          <WrapperProfileName>
            <ProfileName>{userDataRedux.name}</ProfileName>
          </WrapperProfileName>
          <WrapperProfileDetail>
            <ProfileItemIntro>{userDataRedux.intro}</ProfileItemIntro>
            {/* <ProfileItem>{userDataRedux.email}</ProfileItem> */}
            <ProfileItem>偏好類型：{userDataRedux.preferType}</ProfileItem>
            <ProfileItem>會的樂器：{skillArrayDelimiter}</ProfileItem>
            <div>{userDataRedux.favSinger}</div>
          </WrapperProfileDetail>
        </ProfileTextField>
      </ProfileDetail>
    );
  };

  // const handleOpenTag = (date) => {
  //   let nowDate = Date.now();
  //   if (nowDate < date) {
  //     return <IsOpenTag></IsOpenTag>;
  //   } else {
  //     return <IsCloseTag></IsCloseTag>;
  //   }
  // };
  const handleCancelJoin = async (activityId, userId) => {
    Swal.fire({
      title: "<span style=font-size:24px>確定要退出嗎?</span>",
      customClass: "customSwal2Title",
      // text: "刪除後將無法復原",
      // icon: "warning",
      background: "black",
      // html: "<div style=color:white;>若為已加入活動 退出後需重新申請</div>",
      showCancelButton: true,
      confirmButtonColor: "#43e8d8",
      cancelButtonColor: "#565656",
      confirmButtonText: "<span  style=color:#000>退出</span",
      cancelButtonText: "取消",
      iconColor: "white",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");

        await cancelJoinActivities(activityId, userId);
        let userJoin = userJoinActivityDataRedux;
        let newJoin = userJoin.filter((item) => item.id !== activityId);
        console.log(newJoin);
        dispatch({
          type: "UPDATE_USERJOINACTIVITYDATA",
          data: [...newJoin],
        });
      }
    });
  };

  const handleLogOut = async () => {
    Swal.fire({
      title: "<span style=font-size:24px>確定要登出嗎?</span>",
      customClass: "customSwal2TitleLogOut",

      background: "black",
      showCancelButton: true,
      confirmButtonColor: "none",
      cancelButtonColor: "#565656",
      confirmButtonText: "<span  style=color:#fff>登出</span",
      cancelButtonText: "取消",
    })
      .then(async (result) => {
        console.log(props.isLogIn);
        if (result.isConfirmed) {
          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
          props.setIsLogIn(false);

          await logOut();
          //有bug
          // history.push("/");

          Swal.fire({
            title: "<span style=font-size:24px>已登出</span>",
            customClass: "customSwal2Title",
            background: "black",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .then(() => {
        console.log(props.isLogIn);

        console.log(props.isLogIn);
        //跑不進來, 因為isLogIn還是true, 是靠app.js傳進來的props.uid redirect到首頁
        if (props.isLogIn === false) {
          console.log("isLogin = false");
          history.push("/");
        }
      });
  };
  //?? 應該是沒用到
  function onEdit(arr) {
    if (arr.length === userDataRedux.length) {
      setUserActivities(arr);
    }
  }

  useEffect(() => {
    // getUserProfileData();
    checkUserIsLogin();
    //渲染頁面之前先清空，避免裡面有重複之前的data
    setUserJoinActivities([]);
  }, [checkUserIsLogin]);

  // useEffect(() => {
  //   getUserActivitiesData();
  // }, []);
  useEffect(() => {
    getUserActivitiesData();
  }, [userData, getUserActivitiesData]);

  if (props.userUid === "") {
    return <IsLoading />;
    // return null;
  } else if (!props.userUid) {
    history.push("/");
    return "redirection";
  }

  if (!userActivities || !userJoinActivities) {
    // return "isLoading";
    // return <CircularIndeterminate />;
    return <IsLoading />;
  }

  // handleOpenTag();

  const renderHostActivities = () => {
    if (userHostActivityDataRedux.length !== 0) {
      const activitiesHTML = userHostActivityDataRedux.map((data, index) => {
        let date = data.date;
        let time = data.time;
        let newFormatDate = new Date(`${date}T${time}`);
        let nowDate = Date.now();

        let activityTime = newFormatDate.toString();
        let showTime = activityTime.toString().slice(0, 21);
        // let showTime = data.newTimestamp.toString().slice(0, 21);
        let requirementHTML = data.requirement.map((data) => {
          return <span key={data}>{data} </span>;
        });

        if (newFormatDate > nowDate) {
          return (
            <Animated
              key={data.id}
              animationIn="fadeIn"
              // animationOut="fadeOut"
              isVisible={true}
              animationInDelay={index * 50}
            >
              <EachActivityContainer
                style={
                  toggleFilter ? { display: "block" } : { display: "none" }
                }
              >
                <Link to={`/activities/${data.id}`}>
                  <ActivityImage src={data.fileSource} />
                  <Canvas>
                    <EachActivityField className="Field">
                      {/* <EachActivitityIsOpen>
                      {handleOpenTag(newFormatDate)}
                    </EachActivitityIsOpen> */}
                      <EachActivityContent>
                        {/* <div>{data.host}</div> */}
                        <Time>{showTime}</Time>
                        <Title>{data.title}</Title>

                        {/* <div>{data.id}</div> */}
                        <Requirement>{requirementHTML}</Requirement>
                      </EachActivityContent>
                    </EachActivityField>
                  </Canvas>
                </Link>

                <ButtonField>
                  <EditActivitiesButton
                    activityId={data.id}
                    data={data}
                    setUserActivities={setUserActivities}
                    confirmArray={confirmArray}
                    onEdit={onEdit}
                  />
                  <EditActivitiesMemberButton
                    applicants={data.applicants}
                    attendants={data.attendants}
                    activityId={data.id}
                    data={data}
                  />
                </ButtonField>
              </EachActivityContainer>
            </Animated>
          );
        } else if (newFormatDate < nowDate) {
          return (
            <EachHistoryActivityContainer
              key={data}
              style={!toggleFilter ? { display: "block" } : { display: "none" }}
            >
              <Link to={`/activities/${data.id}`}>
                <ActivityImage src={data.fileSource} />
                <Canvas>
                  <EachActivityField className="Field">
                    {/* <EachActivitityIsOpen>
                      {handleOpenTag(newFormatDate)}
                    </EachActivitityIsOpen> */}
                    <EachActivityContent>
                      {/* <div>{data.host}</div> */}
                      <Time>{showTime}</Time>
                      <Title>{data.title}</Title>

                      {/* <div>{data.id}</div> */}
                      <Requirement>{requirementHTML}</Requirement>
                    </EachActivityContent>
                  </EachActivityField>
                </Canvas>
              </Link>
            </EachHistoryActivityContainer>
          );
        }
        return null;
      });
      return activitiesHTML;
    } else {
      return <NoContent>沒有開團</NoContent>;
    }
  };

  const renderJoinActivities = () => {
    if (userJoinActivityDataRedux.length !== 0) {
      const joinActivitiesHTML = userJoinActivityDataRedux.map((data) => {
        let date = data.date;
        let time = data.time;
        let newFormatDate = new Date(`${date}T${time}`);
        let nowDate = Date.now();
        let activityTime = data.timestamp.toDate().toString();
        let showTime = activityTime.slice(0, 21);

        let requirementHTML = data.requirement.map((data) => {
          return <span key={data}>{data} </span>;
        });

        const applyStatusHTML = () => {
          if (data.attendants.includes(userDataRedux.uid)) {
            return <ApplyStatusTagJoin key={data}>已加入</ApplyStatusTagJoin>;
          } else if (data.applicants.includes(userDataRedux.uid)) {
            return <ApplyStatusTagWait key={data}>申請中</ApplyStatusTagWait>;
          }
          return applyStatusHTML;
        };

        if (newFormatDate > nowDate) {
          return (
            // <Link to={`/activities/${data.id}`}>
            <Animated
              animationIn="fadeIn"
              // animationOut="fadeOut"
              isVisible={true}
            >
              <EachActivityContainer
                style={
                  toggleJoinFilter ? { display: "block" } : { display: "none" }
                }
              >
                <Link to={`/activities/${data.id}`}>
                  <ActivityImage src={data.fileSource} />
                  <Canvas>
                    <EachActivityField className="Field">
                      <EachActivityContent>
                        <Time>{showTime}</Time>
                        <Title>{data.title}</Title>
                        <Requirement>{requirementHTML}</Requirement>
                      </EachActivityContent>

                      <StatusTag>{applyStatusHTML()}</StatusTag>
                    </EachActivityField>
                  </Canvas>
                </Link>

                <CheckActivityButtonField>
                  {/* <Link to={`/activities/${data.id}`}> */}
                  <CheckActivityBtn
                    onClick={() => {
                      handleCancelJoin(data.id, userDataRedux.uid);
                    }}
                  >
                    退出活動
                  </CheckActivityBtn>
                  {/* </Link> */}
                </CheckActivityButtonField>
              </EachActivityContainer>
            </Animated>
            // </Link>
          );
        } else if (newFormatDate < nowDate) {
          return (
            <EachHistoryActivityContainer
              style={
                !toggleJoinFilter ? { display: "block" } : { display: "none" }
              }
            >
              <Link to={`/activities/${data.id}`}>
                <ActivityImage src={data.fileSource} />

                <Canvas>
                  <EachActivityField className="Field">
                    <EachActivityContent>
                      <Time>{showTime}</Time>
                      <Title>{data.title}</Title>
                      <Requirement>{requirementHTML}</Requirement>
                    </EachActivityContent>
                  </EachActivityField>
                </Canvas>
              </Link>
            </EachHistoryActivityContainer>
          );
        }
        return null;
      });
      return joinActivitiesHTML;
    } else {
      return <NoContent>未有活動</NoContent>;
    }
  };

  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <MainContainer>
        <ProfilePageContainer>
          <ActivitiesCol>
            <MyHostTitle>
              我的開團
              <FilterBtnField>
                <FilterBtn
                  style={
                    toggleFilter
                      ? { background: "#43ede8", color: "black" }
                      : { background: "black", color: "white" }
                  }
                  onClick={() => {
                    setToggleFilter(true);
                  }}
                >
                  進行中
                </FilterBtn>
                <FilterBtn
                  style={
                    !toggleFilter
                      ? { background: "#43ede8", color: "black" }
                      : { background: "black", color: "white" }
                  }
                  onClick={() => {
                    setToggleFilter(false);
                  }}
                >
                  已結束
                </FilterBtn>
              </FilterBtnField>
            </MyHostTitle>

            <MyHost>{renderHostActivities()}</MyHost>

            <MyJoinTitle>
              我的跟團
              <FilterBtnField>
                <FilterBtn
                  style={
                    toggleJoinFilter
                      ? { background: "#43ede8", color: "black" }
                      : { background: "black", color: "white" }
                  }
                  onClick={() => {
                    setToggleJoinFilter(true);
                  }}
                >
                  進行中
                </FilterBtn>
                <FilterBtn
                  style={
                    !toggleJoinFilter
                      ? { background: "#43ede8", color: "black" }
                      : { background: "black", color: "white" }
                  }
                  onClick={() => {
                    setToggleJoinFilter(false);
                  }}
                >
                  已結束
                </FilterBtn>
              </FilterBtnField>
            </MyJoinTitle>
            <MyJoin>{renderJoinActivities()}</MyJoin>
          </ActivitiesCol>

          <ProfileCol>
            {renderProfile()}
            <ProfileButtonField>
              <EditProfileButton data={userData} />
              {/* <Link to={"./"}> */}
              <LogoutBtn onClick={() => handleLogOut()}>登出</LogoutBtn>
              {/* </Link> */}
            </ProfileButtonField>
          </ProfileCol>
        </ProfilePageContainer>
      </MainContainer>
    </ModalProvider>
  );
}

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;
const MainContainer = styled.div`
  min-height: calc(100vh - 180px);
  background: #121212;
  /* background: black; */
  background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.8)),
    url(${amplifierImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-attachment: fixed;
  position: relative;
`;

const ProfilePageContainer = styled.div`
  display: flex;
  width: 1024px;
  justify-content: space-around;
  margin: 0 auto;
  padding: 60px 20px;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    max-width: 768px;
  }
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 100%;
  }
`;
const ProfileCol = styled.div`
  width: 360px;
  padding: 30px 50px;
  margin: 25px 30px;
  background: #121212;
  /* border: 2px solid #ff0099; */
  height: 100%;
  @media (max-width: 1024px) {
    width: 100%;
    /* height: 300px; */
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  @media (max-width: 768px) {
    width: 90%;
    height: 100%;
    flex-direction: column;
  }
  @media (max-width: 576px) {
    width: 100%;
    padding: 30px 30px;
  }
  @media (max-width: 414px) {
    width: 100%;
  }
`;
const ProfileDetail = styled.div`
  color: white;
  align-items: center;
  @media (max-width: 1024px) {
    display: flex;
  }
  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;
const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;

  @media (max-width: 1024px) {
  }
`;
const ProfileTextField = styled.div`
  @media (max-width: 1024px) {
    margin-left: 20px;
    margin-right: 20px;
    width: 320px;
  }
  @media (max-width: 768px) {
    width: 100%;
    margin-right: unset;
    margin-left: unset;
  }
`;
const ProfileName = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin: 10px auto;

  width: auto;
  @media (max-width: 1024px) {
    text-align: left;
  }
  @media (max-width: 768px) {
  }
`;
const ProfileItem = styled.div`
  margin-top: 10px;
  letter-spacing: 1px;
  margin-bottom: 20px;
`;

const ProfileItemIntro = styled(ProfileItem)`
  /* padding: 10px 10px; */
  letter-spacing: 1px;
  line-height: 20px;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const WrapperProfileName = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
const WrapperProfileDetail = styled.div`
  text-align: left;
`;
const LogoutBtn = styled.button`
  border: 1px solid #ff00ff;
  border-radius: 8px;
  width: 116px;
  height: 40px;
  padding: 10px;
  color: #fff;
  /* background: #ff00ff; */
  cursor: pointer;
  transition: 0.2s;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
  box-shadow: inset 0 0 10px #ff00ff, 0 0 10px #ff00ff;
  &:hover {
    transform: translateY(-2px);

    background: #ff00ff;
    box-shadow: inset 0 0 20px #ff00ff, 0 0 20px #ff00ff;
    color: white;
  }
`;
const ActivitiesCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  @media (max-width: 1024px) {
    margin-top: 30px;
    width: 100%;
  }
`;
const MyHostTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  position: relative;
`;
const MyJoinTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  position: relative;
`;
const MyHost = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
  min-height: 285px;
  position: relative;

  @media (max-width: 1024px) {
    display: flex;
    flex-wrap: wrap;
    width: 640px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    width: 100%;
  }
`;
// const MyJoin = styled.div`
//   /* width: 100%; */
//   display: flex;

//   flex-wrap: wrap;
//   justify-content: space-between;
//   padding: 0 20px;
//   position: relative;
//   min-height: 270px;

//   @media (max-width: 1024px) {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     justify-items: center;
//   }
//   @media (max-width: 768px) {
//     display: flex;
//     flex-direction: column;
//   }
// `;
const MyJoin = styled.div`
  /* width: 100%; */
  display: flex;

  flex-wrap: wrap;
  justify-content: flex-start;
  /* margin-right: 30px; */
  padding: 0;
  position: relative;
  min-height: 285px;

  @media (max-width: 1024px) {
    display: flex;
    flex-wrap: wrap;
    width: 640px;
    margin: 0 auto;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    width: 100%;
  }
`;
const NoContent = styled.div`
  width: 100%;
  margin: auto;
  font-size: 24px;
  font-weight: 600;
  position: absolute;
  top: 50%;
  color: white;
  @media (max-width: 1024px) {
  }
`;
const EachActivityContainer = styled.div`
  width: 250px;
  height: 250px;
  background: #555;
  border-radius: 4px;

  margin: 0px 18px 36px 18px;
  position: relative;
  overflow: hidden;
  @media (max-width: 1024px) {
    margin: 0px 35px 35px 35px;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
`;
const EachHistoryActivityContainer = styled.div`
  width: 250px;
  height: 250px;
  background: #555;
  border-radius: 4px;

  margin: 0px 18px 36px 18px;

  position: relative;
  overflow: hidden;
  @media (max-width: 1024px) {
    margin: 0px 35px 35px 35px;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
    margin-left: auto;
    margin-right: auto;
  }
`;
const EachActivityField = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
  }
`;
const ActivityImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 4px;
  transition: 0.3s;
  &:hover {
    transform: scale(1.2);
  }
  @media (max-width: 768px) {
    height: 180px;
  }
`;
const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  border-radius: 4px;

  background: rgba(0, 0, 0, 0.7);
  pointer-events: none;
  @media (max-width: 768px) {
    width: 100%;
    height: 180px;
  }
`;

const EachActivityContent = styled.div`
  /* text-align: left; */
  padding: 10px;
  margin: 10px;
  line-height: 30px;
  color: white;
  height: 230px;
  border: 1px solid #979797;
  @media (max-width: 768px) {
    max-width: 100%;
    height: 160px;
    text-align: left;
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  height: 60px;
  @media (max-width: 414px) {
    font-size: 20px;
    width: calc(100% - 100px);
  }
`;
const Time = styled.div`
  font-size: 16px;
  font-weight: 300;
  @media (max-width: 414px) {
    font-size: 8px;
  }
`;
const Requirement = styled.div`
  margin-top: 10px;
  height: 60px;

  @media (max-width: 768px) {
    margin-top: 0px;

    line-height: 25px;
    width: 60%;
  }
  @media (max-width: 414px) {
    font-size: 10px;
    margin-top: 0px;
    height: unset;
    width: calc(100% - 100px);
  }
`;
const ButtonField = styled.div`
  display: flex;
  /* padding: 0 30px; */
  justify-content: space-around;
  gap: 20px;
  position: absolute;
  bottom: 20px;
  margin: 0 auto;
  max-width: 200px;
  width: 100%;
  left: 25px;
  @media (max-width: 768px) {
    left: unset;
    right: 20px;
    flex-direction: column;
    bottom: 40px;
    max-width: 100px;
  }
  @media (max-width: 414px) {
    right: 15px;
    width: 100px;
    bottom: 50px;
  }
`;
const ProfileButtonField = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
  @media (max-width: 414px) {
    justify-content: space-between;
    padding: unset;
  }
`;
const CheckActivityButtonField = styled(ButtonField)`
  /* max-width: 90px;
  left: 80px; */
  width: 100%;
  @media (max-width: 768px) {
    left: unset;
    right: 20px;
    flex-direction: column;
    bottom: 20px;
  }
  @media (max-width: 414px) {
    right: 15px;
    width: 100px;
  }
`;
// const CheckActivityButtonField = styled.div`
//   padding: 0 30px;
// `;
const CheckActivityBtn = styled.button`
  /* border: 1px solid #43e8d8; */
  border-radius: 8px;
  width: 90px;
  height: 40px;
  /* padding: 12px 40px; */
  background: #565656;
  color: #fff;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: white;
    background: #272727;
    transform: translateY(-2px);
  }
  @media (max-width: 414px) {
    font-size: 14px;
    padding: 2px;
    width: 90px;

    height: 30px;
  }
`;
const FilterBtnField = styled.div`
  font-size: 16px;
  width: 120px;
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0px;
  justify-content: space-between;
`;
const FilterBtn = styled.button`
  width: 60px;
  height: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0 10px #fff;
  }
`;
const StatusTag = styled.div`
  position: absolute;
  top: 10px;
  right: 5px;
`;
// const EachActivitityIsOpen = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
// `;
// const IsOpenTag = styled.div`
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background: green;
// `;
// const IsCloseTag = styled.div`
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background: grey;
// `;
const ApplyStatusTag = styled.div`
  /* width: 20px;
  height: 20px; */
  /* border-radius: 50%; */
  /* background: white; */
`;
const ApplyStatusTagJoin = styled(ApplyStatusTag)`
  color: white;
  transform: rotate(0.1turn);
  border: 1px solid rgb(67 232 216);
  box-shadow: 0 0 5px rgb(67 232 216);
  text-shadow: 0 0 5px rgb(67 232 216), 0 0 10px rgb(67 232 216),
    0 0 20px rgb(67 232 216), 0 0 40px rgb(67 232 216);
`;
const ApplyStatusTagWait = styled(ApplyStatusTag)`
  color: white;
  border: 1px solid #ff00ff;
  box-shadow: 0 0 5px #ff00ff;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
  transform: rotate(0.96turn);
`;
export default Profile;
