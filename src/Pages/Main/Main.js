import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import { keyframes } from "styled-components";
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
import InstrumentBanner from "./InstrumentBanner";
import PaginationControlled from "./PaginationControlled";

const db = window.firebase.firestore();
let allActivitiesArrayCopy = [];
let allActivitiesArray = [];

function Main() {
  const [data, setData] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [userDataUid, setUserDataUid] = useState();
  const [page, setPage] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [allPaginateArray, setAllPaginateArray] = useState([]);
  let pageLen = 9;
  console.log(data);
  console.log(page);

  console.log(allPaginateArray[page - 1]);

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

  const handlePagination = () => {
    let allPageArray = [];

    let currentTime = Date.now();

    let openActivityArray = data.filter((item) => {
      return item.timestamp.toMillis() > currentTime;
    });
    console.log(openActivityArray);

    const pageArray = openActivityArray.slice(0, pageLen);
    const pageNum = Math.ceil(openActivityArray.length / pageLen);
    setPageNum(pageNum);
    for (let i = 0; i < openActivityArray.length; i = i + pageLen) {
      let pageArray = openActivityArray.slice(i, i + pageLen);
      allPageArray.push(pageArray);
    }
    console.log(allPageArray);

    setAllPaginateArray(allPageArray);
  };

  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
  ];

  // const activitiesFilterHTML = () => {};

  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    console.log(userUid);
    if (userUid) {
      setUserDataUid(userUid);
      const userData = await getUserData(userUid);
      console.log(userData);
    }
  };

  useEffect(() => {
    //渲染頁面之前先把存活動的array清空，避免array裡面有重複之前的data
    allActivitiesArray = [];
    checkUserIsLogin();
    getFirebaseData();
  }, []);

  useEffect(() => {
    handlePagination();
  }, [data]);
  // if (!data) {
  //   return "isLoading";
  // }
  // if (!data) {
  //   console.log("haha");
  //   return "Loading";
  // }

  // if (!data || allPaginateArray.length <= 0) {
  //   return <div style={{ minHeight: `calc(100vh - 180px) ` }}>Loading</div>;
  // }

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

  const sloganButtonHTML = () => {
    if (userDataUid) {
      return (
        <Link to={`/activities/profile`}>
          <JoinButton>查看我的活動</JoinButton>
        </Link>
      );
    } else {
      return (
        <Link to={`/activities/login`}>
          <JoinButton>加入Let's JAM</JoinButton>
        </Link>
      );
    }
  };

  const ActivityHTML =
    allPaginateArray.length > 0 ? (
      allPaginateArray[page - 1].map((item, index) => {
        let firebaseTime = item.timestamp.toMillis();
        let activityTime = item.timestamp.toDate().toString();
        let showTime = activityTime.slice(0, 21);
        let currentTime = Date.now();

        let requirementHTML = item.requirement.map((data) => {
          return <span>{data} </span>;
        });
        let attendantsNum = item.attendants.length;

        if (firebaseTime > currentTime) {
          return (
            <Link to={`/activities/${item.id}`}>
              <ActivityItem
              // style={{
              //   backgroundImage: `url(${item.fileSource})`,
              // }}
              >
                <ActivityImage src={item.fileSource} />
                <Canvas>
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
        }
      })
    ) : (
      <NoResultContainer>
        <NoResult>無符合條件的活動</NoResult>
      </NoResultContainer>
    );

  return (
    <MainContainer>
      <Carosul>
        {/* <MainImg src={neonBand} alt="" /> */}
        <Slogan>
          整個城市<br></br>都是我的練團室
        </Slogan>
        <JoinButtonContainer>{sloganButtonHTML()}</JoinButtonContainer>
      </Carosul>
      {/* <Neon data-text="成果牆">成果牆</Neon> */}
      {/* <div>
        <InstrumentBanner />
      </div> */}
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
      {/* <Link to={`./`}>
        <button
          onClick={(e) => {
            logOut();
          }}
        >
          logout
        </button>
      </Link> */}
      <PageControllContainer>
        <PaginationControlled count={pageNum} page={page} setPage={setPage} />
      </PageControllContainer>
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
  /* background-color: #7b7b7b; */
  background-color: #1b1b1b;
  /* background-color: #4e3a3a; */
  min-height: calc(100vh - 180px);
  padding-bottom: 50px;
`;

const Carosul = styled.div`
  height: 500px;
  background: url(${neonBand});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
  @media (max-width: 576px) {
    height: 300px;
  }
`;
const NeonShine = keyframes`
  0% {opacity: 1}
  1%{opacity:0;}
  2%{opacity:1;}

  5%{opacity:1;}
  6%{opacity:0;}

  21%{opacity:1;}

  90% {opacity: 1}
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
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  animation: ${NeonShine} 3s 1s linear infinite;
  @media (max-width: 576px) {
    font-size: 36px;
    left: 60px;
  }
`;

const JoinButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  top: 80%;
`;
const JoinButton = styled.button`
  border: 1px solid none;
  border-radius: 20px;
  background: #ff00ff;
  height: 40px;
  width: 200px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
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
  @media (max-width: 576px) {
    font-size: 12px;
    padding-left: 0px;
  }
`;

const Filterlabel = styled.label`
  font-weight: bold;
  line-height: 30px;
  margin: 0 20px;
  @media (max-width: 576px) {
    margin: 0 10px;
    font-size: 12px;
  }
  @media (max-width: 414px) {
    margin: 0 5px;
  }
`;
const FilterBar = styled.div`
  border: 1px solid white;
  height: 30px;

  align-items: center;
  margin-left: 20px;
  padding-right: 10px;
  @media (max-width: 576px) {
    font-size: 12px;
  }
  @media (max-width: 414px) {
    margin-left: 10px;
  }
`;

const ActivitiesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  /* flex-wrap: wrap; */
  margin: 0 auto;
  margin: 0 auto;
  max-width: 1024px;
  justify-items: center;
  position: relative;
  min-height: 940px;
  /* align-items: center; */
  /* justify-content: space-around; */

  @media (max-width: 985px) {
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    grid-column-gap: 0px;
    grid-row-gap: 20px;
    max-width: 700px;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const ActivityItem = styled.div`
  border: 1px solid #979797;
  width: 300px;
  height: 300px;
  border-radius: 20px;
  background: #000;
  /* margin-bottom: 40px; */
  text-align: left;
  /* padding-top: 20px;
  padding-left: 30px; */
  line-height: 30px;
  color: #fff;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;

  /* &:hover {
    background: white;
    color: black;
  } */
  /* &:hover {
    transform: scale(1.5);
  } */
  overflow: hidden;

  @media (max-width: 768px) {
    width: 90%;
    height: 200px;
    margin: 0 auto;
  }
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 20px;

  background: rgba(0, 0, 0, 0.7);
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    color: black;
    transform: scale(1.05);
  }
  pointer-events: none;
  /* z-index: -1; */

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ActivityContent = styled.div`
  margin: 20px 25px;
  position: relative;
  @media (max-width: 768px) {
    /* margin-top: 10px;
    margin-left: 20px; */
  }
`;
const NoResultContainer = styled.div`
  position: absolute;
  width: 200px;
  text-align: center;
  align-items: center;
`;
const NoResult = styled.div`
  font-size: 20px;
`;
const PageControllContainer = styled.div`
  margin: 10px auto;
  max-width: 1024px;
  display: flex;
`;
const Title = styled.div`
  font-size: 24px;
  height: 30px;
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
  height: 80px;
  @media (max-width: 768px) {
    font-size: 16px;
    height: unset;
  }
`;
const Location = styled.div`
  height: 50px;
  line-height: 20px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;
const Host = styled.div``;
const AttendantNum = styled.div`
  font-size: 16px;
  @media (max-width: 768px) {
    position: absolute;
    right: 20px;
    bottom: 25px;
    font-size: 16px;
  }
`;
const ActivityImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  /* background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)); */

  transition: all 0.5s ease 0s;
  &:hover {
    transform: scale(1.2);
    opacity: 0.5;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
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
