import "./App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData } from "./utils/firebase";

function Profile() {
  let userId = "vfjMHzp45ckI3o3kqDmO";
  const [userData, setUserData] = useState();

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    console.log(data);
    setUserData(data);
  };
  const renderProfile = () => {
    console.log(userData);
    return (
      <div>
        <div>{userData.profileImage}</div>
        <div>{userData.name}</div>
        <div>{userData.email}</div>
        <div>{userData.preferType}</div>
        <div>{userData.skill}</div>
        <div>{userData.favSinger}</div>
      </div>
    );
  };

  const handleEditProfile = () => {};

  useEffect(() => {
    console.log("><");
    getUserProfileData();
  }, []);

  if (!userData) {
    return "isLoading";
  }

  return (
    <div>
      <div>this is profile page</div>
      {renderProfile()}
      <button>Edit</button>
    </div>
  );
}

export default Profile;
