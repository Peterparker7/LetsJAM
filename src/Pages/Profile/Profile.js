import "../../App.css";
import "./swal2.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  getUserData,
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

import IsLoading from "../../Components/IsLoading";
import Swal from "sweetalert2";
import { Animated } from "react-animated-css";
import { MyContext } from "../../MyContext";

function Profile(props) {
  const [userData, setUserData] = useState({});
  const [userActivities, setUserActivities] = useState();
  const [userJoinActivities, setUserJoinActivities] = useState([]);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [toggleJoinFilter, setToggleJoinFilter] = useState(true);
  const { userUid } = useContext(MyContext);

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

  const userDataGet = useCallback(() => {
    const userDataGetting = async () => {
      if (userUid) {
        const data = await getUserData(userUid);
        dispatch({ type: "UPDATE_USERDATA", data: data });
        setUserData(data);
      }
    };
    userDataGetting();
  }, [dispatch, userUid]);

  const getUserActivitiesData = useCallback(() => {
    const gettingUserActivitiesData = async () => {
      if (userData.uid) {
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
      }
    };
    gettingUserActivitiesData();
  }, [dispatch, userData.uid]);

  const renderProfile = () => {
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
            <ProfileItem>偏好類型：{userDataRedux.preferType}</ProfileItem>
            <ProfileItem>會的樂器：{skillArrayDelimiter}</ProfileItem>
            <div>{userDataRedux.favSinger}</div>
          </WrapperProfileDetail>
        </ProfileTextField>
      </ProfileDetail>
    );
  };

  const handleCancelJoin = async (activityId, userId) => {
    Swal.fire({
      title: "<span style=font-size:24px>確定要退出嗎?</span>",
      customClass: "customSwal2Title",
      background: "black",
      showCancelButton: true,
      confirmButtonColor: "#43e8d8",
      cancelButtonColor: "#565656",
      confirmButtonText: "<span  style=color:#000>退出</span",
      cancelButtonText: "取消",
      iconColor: "white",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await cancelJoinActivities(activityId, userId);
        let userJoin = userJoinActivityDataRedux;
        let newJoin = userJoin.filter((item) => item.id !== activityId);
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
        if (result.isConfirmed) {
          props.setIsLogIn(false);

          await logOut();

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
        //跑不進來, 因為isLogIn還是true, 是靠app.js傳進來的props.uid redirect到首頁
        if (props.isLogIn === false) {
          history.push("/");
        }
      });
  };

  useEffect(() => {
    //渲染頁面之前先清空，避免裡面有重複之前的data
    setUserJoinActivities([]);
  }, []);

  useEffect(() => {
    userDataGet();
  }, [userDataGet]);

  useEffect(() => {
    getUserActivitiesData();
  }, [userData, getUserActivitiesData]);

  if (props.userUid === "") {
    return <IsLoading loadingStyle={"normal"} size={40} />;
  } else if (!props.userUid) {
    history.push("/");
    return "redirection";
  }

  if (!userActivities || !userJoinActivities) {
    return <IsLoading loadingStyle={"normal"} size={40} />;
  }

  const renderHostActivities = () => {
    if (userHostActivityDataRedux.length !== 0) {
      const activitiesHTML = userHostActivityDataRedux.map((data, index) => {
        let date = data.date;
        let time = data.time;
        let newFormatDate = new Date(`${date}T${time}`);
        let nowDate = Date.now();

        let activityTime = newFormatDate.toString();
        let showTime = activityTime.toString().slice(0, 21);
        let requirementHTML = data.requirement.map((data) => {
          return <span key={data}>{data} </span>;
        });

        if (newFormatDate > nowDate) {
          return (
            <Animated
              key={data.id}
              animationIn="fadeIn"
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
                      <EachActivityContent>
                        <Time>{showTime}</Time>
                        <Title>{data.title}</Title>
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
            <Animated key={data.id} animationIn="fadeIn" isVisible={true}>
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
                  <CheckActivityBtn
                    onClick={() => {
                      handleCancelJoin(data.id, userDataRedux.uid);
                    }}
                  >
                    退出活動
                  </CheckActivityBtn>
                </CheckActivityButtonField>
              </EachActivityContainer>
            </Animated>
          );
        } else if (newFormatDate < nowDate) {
          return (
            <EachHistoryActivityContainer
              key={data.id}
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
              <LogoutBtn onClick={() => handleLogOut()}>登出</LogoutBtn>
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
  height: 100%;
  @media (max-width: 1024px) {
    padding: 30px 30px;

    width: 100%;
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
    margin-left: 30px;
    margin-right: 30px;
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
const MyJoin = styled.div`
  display: flex;

  flex-wrap: wrap;
  justify-content: flex-start;

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
    margin-top: 20px;
  }
`;
const CheckActivityButtonField = styled(ButtonField)`
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

const CheckActivityBtn = styled.button`
  border-radius: 8px;
  width: 90px;
  height: 40px;
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

const ApplyStatusTag = styled.div``;
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
