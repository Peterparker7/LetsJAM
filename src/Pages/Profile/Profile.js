import "../../App.css";
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
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import EditProfileButton from "./EditProfileButton.js";
import EditActivitiesButton from "./EditActivitiesButton.js";
import EditActivitiesMemberButton from "./EditActivitiesMemberButton.js";

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

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;
const MainContainer = styled.div`
  height: 100vh;
`;

const ProfileContainer = styled.div`
  display: flex;
  width: 960px;
  justify-content: space-around;
  margin: 0 auto;
`;
const ProfileCol = styled.div`
  width: 360px;
`;
const ActivitiesCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;
const MyHostTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
`;
const MyJoinTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
`;
const MyHost = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const MyJoin = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

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
      <div>
        <img src={`${userData.profileImage}`} />
        <div>{userDataRedux.name}</div>
        <div>{userDataRedux.intro}</div>
        <div>{userDataRedux.email}</div>
        <div>偏好類型：{userDataRedux.preferType}</div>
        <div>會的樂器：{userDataRedux.skill}</div>
        <div>{userDataRedux.favSinger}</div>
      </div>
    );
  };

  const handleEditProfile = () => {};

  function onEdit(arr) {
    if (arr.length === userDataRedux.length) {
      setUserActivities(arr);
    }
  }

  useEffect(() => {
    // getUserProfileData();
    checkUserIsLogin();
  }, []);

  useEffect(() => {
    getUserActivitiesData();
  }, [userData]);

  if (!userActivities || !userJoinActivities) {
    return "isLoading";
  }

  const renderHostActivities = () => {
    if (userHostActivityDataRedux.length !== 0) {
      const activitiesHTML = userHostActivityDataRedux.map((data) => {
        return (
          <div>
            <div>{data.title}</div>
            <div>{data.host}</div>
            <div>{data.id}</div>
            <div>{data.requirement}</div>
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
          </div>
        );
      });
      return activitiesHTML;
    } else {
      return <div>沒有開團</div>;
    }
  };

  const renderJoinActivities = () => {
    if (userJoinActivities.length !== 0) {
      const joinActivitiesHTML = userJoinActivities.map((data) => {
        const applyStatusHTML = () => {
          if (data.attendants.includes(userId)) {
            return <div style={{ backgroundColor: "green" }}>已加入</div>;
          } else if (data.applicants.includes(userId)) {
            return <div style={{ backgroundColor: "yellow" }}>申請中</div>;
          }
          return applyStatusHTML;
        };

        return (
          <div>
            <div>{data.title}</div>
            <div>{data.host}</div>
            <div>{data.id}</div>
            <div>
              <Link to={`/activities/${data.id}`}>
                <button>查看活動</button>
              </Link>
            </div>
            <div>{applyStatusHTML()}</div>
          </div>
        );
      });
      return joinActivitiesHTML;
    } else {
      return <div>未有活動</div>;
    }
  };

  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <MainContainer>
        <div>this is profile page</div>
        <ProfileContainer>
          <ActivitiesCol>
            <MyHostTitle>我的開團</MyHostTitle>
            <MyHost>{renderHostActivities()}</MyHost>

            <MyJoinTitle>我的跟團</MyJoinTitle>
            <MyJoin>{renderJoinActivities()}</MyJoin>
          </ActivitiesCol>

          <ProfileCol>
            {renderProfile()}
            <EditProfileButton data={userData} />
          </ProfileCol>
        </ProfileContainer>
      </MainContainer>
    </ModalProvider>
  );
}

export default Profile;
