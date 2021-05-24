import "../../App.css";
import "../../normalize.css";
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
import neonBand from "../../images/neon-band.jpg";
import guitar from "../../images/guitar.svg";

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

    //也顯示揪團主，待更改
    //   data.forEach(async (item, index) => {
    //     const eachHost = await getUserData(item.host).then((res) => {
    //       // hostDetailArray.push(res);
    //       // console.log(hostDetailArray);
    //       data[index].host = res;

    //       return res;
    //     });
    //   });

    // setData(data);
    // allActivitiesArray.push(...data);
    // allActivitiesArrayCopy.push(...data);
    // console.log(allActivitiesArray);
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
    let activityTime = item.timestamp.toDate().toString();
    let showTime = activityTime.slice(0, 24);
    let requirementHTML = item.requirement.map((data) => {
      return <span>{data} </span>;
    });
    let attendantsNum = item.attendants.length;

    return (
      <Link to={`/activities/${item.id}`}>
        <ActivityItem style={{ backgroundImage: `url(${item.fileSource})` }}>
          <Canvas style={{ background: `background: rgba(76, 175, 80, 0.3)` }}>
            {/* <div>{item.id}</div> */}
            <ActivityContent>
              <Time>{showTime}</Time>

              <Title>{item.title}</Title>
              <Type>{item.type}</Type>
              <Requirement>{requirementHTML}</Requirement>
              <Location>{item.location}</Location>
              {/* <Host>揪團主：{item.host.name}</Host> */}
              <AttendantNum>{attendantsNum} 出席者</AttendantNum>
              {/* <ActivityImage src={item.fileSource} alt=""></ActivityImage> */}
            </ActivityContent>
          </Canvas>
        </ActivityItem>
      </Link>
    );
  });

  return (
    <MainContainer>
      <Carosul>
        {/* <MainImg src={neonBand} alt="" /> */}
        <Slogan>
          整個城市<br></br>都是我的練團室
        </Slogan>
        <JoinButton>加入Let's JAM</JoinButton>
      </Carosul>
      {/* <img
        src={guitar}
        alt=""
        style={{ width: "100px", transform: `rotate(${0.125}turn)` }}
      ></img> */}
      {/* <Neon data-text="成果牆">成果牆</Neon> */}
      <ActivityFilter>
        <FilterTitle>篩選活動 依 </FilterTitle>
        <FilterBar>
          <Filterlabel>類型</Filterlabel>
          <select
            style={{ color: "white" }}
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
        </FilterBar>
        <FilterBar>
          <Filterlabel>需求</Filterlabel>
          <select
            style={{ color: "white" }}
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
        </FilterBar>
      </ActivityFilter>
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
    </MainContainer>
  );
  {
    /* <iframe id="ytplayer" type="text/html" width="640" height="360"
  src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"></iframe>; */
  }
}
const MainContainer = styled.main`
  /* background-color: #846767; */
  background-color: #4e3a3a;
  height: 100%;
`;

const Carosul = styled.div`
  height: 500px;
  background: url(${neonBand});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
`;

const Slogan = styled.div`
  color: white;
  position: absolute;
  white-space: pre;
  text-align: left;
  font-size: 48px;
  font-weight: bold;
  top: 50px;
  left: 120px;
`;

const JoinButton = styled.button`
  position: absolute;
  top: 80%;
  left: 45%;
  border: 1px solid none;
  border-radius: 20px;
  background: #ff00ff;
  height: 40px;
  width: 200px;
  font-size: 20px;
  font-weight: bold;
`;

const MainImg = styled.img`
  max-width: 100%;
  height: auto;

  /* object-fit: cover; */
`;

const ActivityFilter = styled.div`
  display: flex;
  margin: 0 auto;
  margin-top: 20px;
  max-width: 1024px;
  justify-content: flex-end;
  padding: 0 20px;
  color: white;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterTitle = styled.div`
  font-size: 16px;
  padding-left: 10px;
`;

const Filterlabel = styled.label`
  font-weight: bold;
  line-height: 30px;
  margin: 0 20px;
`;
const FilterBar = styled.div`
  border: 1px solid white;
  height: 30px;

  align-items: center;
  margin-left: 20px;
  padding-right: 10px;
`;

const ActivitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin: 0 auto;
  max-width: 1024px;
  justify-content: space-around;
`;

const ActivityItem = styled.div`
  border: 1px solid #979797;
  width: 300px;
  height: 300px;
  border-radius: 20px;
  background: #000;
  margin-bottom: 40px;
  text-align: left;
  padding-top: 20px;
  padding-left: 30px;
  line-height: 30px;
  color: #fff;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;

  &:hover {
    background: white;
    color: black;
  }
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 20px;

  background: rgba(0, 0, 0, 0.8);
  &:hover {
    background: white;
    color: black;
  }
`;

const ActivityContent = styled.div`
  margin-top: 20px;
  margin-left: 30px;
`;

const Title = styled.div`
  font-size: 24px;
`;
const Time = styled.div`
  font-size: 12px;
`;
const Type = styled.div`
  font-size: 16px;
`;
const Requirement = styled.div`
  font-size: 20px;
  margin-top: 10px;
`;
const Location = styled.div`
  margin-top: 70px;
`;
const Host = styled.div``;
const AttendantNum = styled.div`
  font-size: 16px;
`;
const ActivityImage = styled.img`
  width: 300px;
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

export default Main;
