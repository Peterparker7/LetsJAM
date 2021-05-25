import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getSpecificData,
  getUserData,
  getAuthUser,
  updateUserData,
  getUserHostActivities,
  getUserJoinActivities,
  getUserApplyActivities,
  agreeJoinActivity,
  kickActivity,
  deleteActivityData,
  updateActivitiesData,
  logOut,
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import EditProfileButton from "./EditProfileButton.js";
import EditActivitiesButton from "./EditActivitiesButton.js";
import EditActivitiesMemberButton from "./EditActivitiesMemberButton.js";
import amplifierImg from "../../images/amplifier-guitar.jpg";
import recordImg from "../../images/retro-record.jpg";

const StyledModal = Modal.styled`
width: 20rem;
height: 20rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;`;

function Profile() {
  let userId = "vfjMHzp45ckI3o3kqDmO";
  //   let userId = "SM7VM6CFOJOZwIDA6fjB";
  const [userData, setUserData] = useState({});
  const [userActivities, setUserActivities] = useState();
  const [userJoinActivities, setUserJoinActivities] = useState([]);
  const userDataRedux = useSelector((state) => state.userData);
  const userHostActivityDataRedux = useSelector(
    (state) => state.userHostActivityData
  );
  const confirmArray = [];
  const dispatch = useDispatch();
  console.log(userDataRedux.uid);
  //fireauth
  window.firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // 使用者已登入，可以取得資料
      var email = user.email;
      var uid = user.uid;
      console.log(email, uid);
    } else {
      // 使用者未登入
    }
  });

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    console.log(userUid);
    const data = await getUserData(userUid);
    console.log(data);
    dispatch({ type: "UPDATE_USERDATA", data: data });
    setUserData(data);
  };

  // const getUserProfileData = async () => {
  //   const data = await getUserData(userId);
  //   dispatch({ type: "UPDATE_USERDATA", data: data });

  //   setUserData(data);
  // };

  const getUserActivitiesData = async () => {
    const data = await getUserHostActivities(userData.uid);
    dispatch({ type: "UPDATE_USERHOSTACTIVITYDATA", data: data });

    const attendActivities = await getUserJoinActivities(userData.uid);

    const applyActivities = await getUserApplyActivities(userData.uid);

    setUserJoinActivities((a) => [...a, ...attendActivities]);
    setUserJoinActivities((a) => [...a, ...applyActivities]);

    setUserActivities(data);
  };

  const renderProfile = () => {
    return (
      <ProfileDetail>
        <Wrapper>
          <ProfileName>{userDataRedux.name}</ProfileName>
        </Wrapper>
        <ProfileImg src={`${userDataRedux.profileImage}`} />
        <Wrapper>
          <ProfileItem>{userDataRedux.intro}</ProfileItem>
          {/* <ProfileItem>{userDataRedux.email}</ProfileItem> */}
          <ProfileItem>偏好類型：{userDataRedux.preferType}</ProfileItem>
          <ProfileItem>會的樂器：{userDataRedux.skill}</ProfileItem>
          <div>{userDataRedux.favSinger}</div>
        </Wrapper>
      </ProfileDetail>
    );
  };

  const handleEditProfile = () => {};

  const handleOpenTag = (date) => {
    let nowDate = Date.now();
    if (nowDate < date) {
      return <IsOpenTag></IsOpenTag>;
    } else {
      return <IsCloseTag></IsCloseTag>;
    }
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
  }, []);

  // useEffect(() => {
  //   getUserActivitiesData();
  // }, []);
  useEffect(() => {
    getUserActivitiesData();
  }, [userData]);

  if (!userActivities || !userJoinActivities) {
    return "isLoading";
  }

  // handleOpenTag();

  const renderHostActivities = () => {
    if (userHostActivityDataRedux.length !== 0) {
      const activitiesHTML = userHostActivityDataRedux.map((data, index) => {
        let date = data.date;
        let time = data.time;
        let newFormatDate = new Date(`${date}T${time}`);
        let activityTime = newFormatDate.toString();
        console.log(activityTime);
        let showTime = activityTime.toString().slice(0, 21);
        // let showTime = data.newTimestamp.toString().slice(0, 21);

        return (
          <EachActivityContainer>
            <EachActivitityIsOpen>
              {handleOpenTag(newFormatDate)}
            </EachActivitityIsOpen>
            <EachActivityContent>
              {/* <div>{data.host}</div> */}
              <Time>{showTime}</Time>
              <Title>{data.title}</Title>

              {/* <div>{data.id}</div> */}
              <div>{data.requirement}</div>
            </EachActivityContent>
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
              />
            </ButtonField>
          </EachActivityContainer>
        );
      });
      return activitiesHTML;
    } else {
      return <NoContent>沒有開團</NoContent>;
    }
  };

  const renderJoinActivities = () => {
    console.log(userHostActivityDataRedux);

    if (userJoinActivities.length !== 0) {
      const joinActivitiesHTML = userJoinActivities.map((data) => {
        let activityTime = data.timestamp.toDate().toString();
        let showTime = activityTime.slice(0, 21);

        const applyStatusHTML = () => {
          if (data.attendants.includes(userDataRedux.uid)) {
            return <div style={{ backgroundColor: "green" }}>已加入</div>;
          } else if (data.applicants.includes(userDataRedux.uid)) {
            return <div style={{ backgroundColor: "yellow" }}>申請中</div>;
          }
          return applyStatusHTML;
        };

        return (
          <EachActivityContainer>
            <EachActivityContent>
              <Time>{showTime}</Time>
              <Title>{data.title}</Title>
              <div>{data.requirement}</div>
            </EachActivityContent>

            <CheckActivityButtonField>
              <Link to={`/activities/${data.id}`}>
                <CheckActivityBtn>查看活動</CheckActivityBtn>
              </Link>
            </CheckActivityButtonField>

            <StatusTag>{applyStatusHTML()}</StatusTag>
          </EachActivityContainer>
        );
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
            <MyHostTitle>我的開團</MyHostTitle>
            <MyHost>{renderHostActivities()}</MyHost>

            <MyJoinTitle>我的跟團</MyJoinTitle>
            <MyJoin>{renderJoinActivities()}</MyJoin>
          </ActivitiesCol>

          <ProfileCol>
            {renderProfile()}
            <EditProfileButton data={userData} />
            <Link to={"./"}>
              <LogoutBtn onClick={() => logOut()}>登出</LogoutBtn>
            </Link>
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
  height: 100%;
  background: #555;
  background: url(${amplifierImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
`;

const ProfilePageContainer = styled.div`
  display: flex;
  width: 1024px;
  justify-content: space-around;
  margin: 0 auto;
  padding-top: 30px;
`;
const ProfileCol = styled.div`
  width: 360px;
  padding: 0 50px;
  margin: 0 30px;
  background: #000;
  border: 2px solid #ff0099;
  height: 500px;
`;
const ProfileDetail = styled.div`
  color: white;
`;
const ProfileImg = styled.img`
  width: auto;
  height: 150px;
`;
const ProfileName = styled.div`
  font-size: 28px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: auto;
`;
const ProfileItem = styled.div`
  margin-top: 10px;
`;
const Wrapper = styled.div`
  text-align: left;
  margin-bottom: 30px;
`;
const LogoutBtn = styled.button`
  border: 1px solid none;
  border-radius: 20px;
  width: 116px;
  height: 40px;
  padding: 10px;
  background: #ff00ff;
  cursor: pointer;
`;
const ActivitiesCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;
const MyHostTitle = styled.div`
  font-size: 24px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20px;
`;
const MyJoinTitle = styled.div`
  font-size: 24px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 20px;
`;
const MyHost = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const MyJoin = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const NoContent = styled.div`
  width: 100%;
  margin: 30px;
  font-size: 24px;
`;
const EachActivityContainer = styled.div`
  width: 250px;
  height: 250px;
  background: #555;
  border-radius: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const EachActivityContent = styled.div`
  text-align: left;
  padding-top: 20px;
  padding-left: 30px;
  line-height: 30px;
  color: white;
`;
const Title = styled.div`
  font-size: 24px;
`;
const Time = styled.div`
  font-size: 14px;
`;

const ButtonField = styled.div`
  display: flex;
  margin-top: 70px;
  padding: 0 30px;
  justify-content: space-between;
`;
const CheckActivityButtonField = styled.div`
  margin-top: 70px;
  padding: 0 30px;
`;
const CheckActivityBtn = styled.button`
  border: 1px solid none;
  border-radius: 10px;
  width: 90px;
  height: 40px;
  padding: 5px;
  background: #ff00ff;
  cursor: pointer;
`;

const StatusTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
const EachActivitityIsOpen = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
const IsOpenTag = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: green;
`;
const IsCloseTag = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: grey;
`;
export default Profile;
