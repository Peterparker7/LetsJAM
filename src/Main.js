import "./App.css";
// import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { getActivityData } from "./utils/firebase";

// var firebaseConfig = {
//   apiKey: "AIzaSyDEsAz0oLPwZ-JQbDGGnq3CQAJK1d7714k",
//   authDomain: "personalproject-33263.firebaseapp.com",
//   projectId: "personalproject-33263",
//   storageBucket: "personalproject-33263.appspot.com",
//   messagingSenderId: "966021952087",
//   appId: "1:966021952087:web:5c52cfb31b031cdf6a6912",
//   measurementId: "G-MXQWY9WWZK",
// };
// // Initialize Firebase
// window.firebase.initializeApp(firebaseConfig);

const db = window.firebase.firestore();
console.log(db);

function Main() {
  const [data, setData] = useState([]);
  console.log(data);

  //   const getActivityData = async () => {
  //     const activityData = db.collection("activityData");
  //     const allActivities = [];

  //     await activityData.get().then((d) => {
  //       d.forEach((data) => {
  //         allActivities.push(data.data());

  //         //   allActivity.push
  //       });
  //     });
  //     setData(allActivities);
  //     return allActivities;
  //   };

  const getFirebaseData = async () => {
    const data = await getActivityData();
    setData(data);
  };
  //Promise.all(promises.then((result)=>{

  //   }))

  useEffect(() => {
    getFirebaseData();
  }, []);
  const ActivityHTML = data.map((item, index) => {
    return (
      <div>
        <Link to={`/activities/${item.id}`}>
          <div>{item.id}</div>
          <img src={item.fileSource} alt="" />
        </Link>
      </div>
    );
  });

  return (
    <div>
      this is main page
      <div>{ActivityHTML}</div>
    </div>
  );
  {
    /* <iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"></iframe>; */
  }
}

export default Main;
