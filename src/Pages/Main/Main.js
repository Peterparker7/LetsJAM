import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import {
  getActivityData,
  getUserData,
  getAuthUser,
  logOut,
} from "../../utils/firebase";

const db = window.firebase.firestore();
console.log(db);
let allActivitiesArrayCopy = [];
let allActivitiesArray = [];

function Main() {
  const [data, setData] = useState([]);
  console.log(data);

  const getFirebaseData = async () => {
    const data = await getActivityData();
    setData(data);
    allActivitiesArray.push(...data);
    allActivitiesArrayCopy.push(...data);
    console.log(allActivitiesArray);
  };
  //Promise.all(promises.then((result)=>{

  //   }))
  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
  ];

  // const activitiesFilterHTML = () => {};

  useEffect(() => {
    //渲染頁面之前先把存活動的array清空，避免array裡面有重複之前的data
    allActivitiesArray = [];
    checkUserIsLogin();
    getFirebaseData();
  }, []);

  if (!data) {
    return "isLoading";
  }

  const handleFilter = (e, filter) => {
    console.log(allActivitiesArrayCopy);
    console.log(e);
    console.log(allActivitiesArray);
    const selectType = document.querySelector("#selectType");
    const selectRequirement = document.querySelector("#selectRequirement");
    console.log(selectType.value);
    if (filter === "type") {
      if (e === "所有類型") {
        if (selectRequirement.value === "所有樂器") {
          setData(allActivitiesArray);
          return;
        }
        const alltype = allActivitiesArray.filter((item) => {
          if (item.requirement.includes(selectRequirement.value)) {
            return item;
          }
        });
        setData(alltype);
        return;
      }
      const iscontain = allActivitiesArray.filter((item) => {
        console.log(item);
        if (item.type.includes(e)) {
          return item;
        }
      });
      console.log(iscontain);
      setData(iscontain);
      if (selectRequirement.value === "所有樂器") {
        setData(iscontain);
      } else {
        const bothcontain = iscontain.filter((item) => {
          if (item.requirement.includes(selectRequirement.value)) {
            return item;
          }
        });
        setData(bothcontain);
      }
    }
    if (filter === "requirement") {
      if (e === "所有樂器") {
        if (selectType.value === "所有類型") {
          setData(allActivitiesArray);
          return;
        }
        const allrequirement = allActivitiesArray.filter((item) => {
          if (item.type.includes(selectType.value)) {
            return item;
          }
        });
        setData(allrequirement);
        return;
      }
      const iscontain = allActivitiesArray.filter((item) => {
        console.log(item);
        if (item.requirement.includes(e)) {
          return item;
        }
      });
      console.log(iscontain);
      if (selectType.value === "所有類型") {
        setData(iscontain);
      } else {
        const bothcontain = iscontain.filter((item) => {
          if (item.type.includes(selectType.value)) {
            return item;
          }
        });
        setData(bothcontain);
      }

      // allActivitiesArray = iscontain;
    }
  };

  const handleRequirementFilter = () => {};

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    console.log(userUid);
    const userData = await getUserData(userUid);
    console.log(userData);
  };

  const ActivityHTML = data.map((item, index) => {
    return (
      <Link to={`/activities/${item.id}`}>
        <ActivityItem>
          <div>{item.id}</div>
          <div>{item.title}</div>
          <ActivityImage src={item.fileSource} alt=""></ActivityImage>
        </ActivityItem>
      </Link>
    );
  });

  return (
    <div>
      this is main page
      <div>
        <div>篩選活動 依</div>
        <div>
          <label>類型</label>
          <select
            id="selectType"
            defaultValue="所有類型"
            onChange={(e) => {
              handleFilter(e.target.value, "type");
            }}
          >
            <option>所有類型</option>
            <option>流行</option>
            <option>嘻哈</option>
            <option>古典</option>
          </select>
        </div>
        <div>
          <label>需求</label>
          <select
            id="selectRequirement"
            defaultValue="所有樂器"
            onChange={(e) => {
              handleFilter(e.target.value, "requirement");
            }}
          >
            <option>所有樂器</option>
            <option>Vocal</option>
            <option>吉他</option>
            <option>木箱鼓</option>
            <option>電吉他</option>
            <option>烏克麗麗</option>
          </select>
        </div>
      </div>
      <ActivitiesContainer>{ActivityHTML}</ActivitiesContainer>
      <Link to={`/activities/create`}>
        <div>start a group</div>
      </Link>
      <Link to={`./`}>
        <button
          onClick={(e) => {
            logOut();
          }}
        >
          logout
        </button>
      </Link>
    </div>
  );
  {
    /* <iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"></iframe>; */
  }
}

const ActivitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ActivityItem = styled.div`
  border: 1px solid #979797;
`;
const ActivityImage = styled.img`
  width: 300px;
`;

export default Main;
