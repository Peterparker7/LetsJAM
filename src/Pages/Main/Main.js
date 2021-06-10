import "../../App.css";
import "../../normalize.css";
import "../../Components/swal2.css";
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
import IsLoading from "../../Components/IsLoading";
import { Animated } from "react-animated-css";
import CircularIndeterminate from "../Create/CircularProgress";
import neonGuitar1 from "../../images/neonGuitar1.png";
import arrowRight from "../../images/arrow-right-short.svg";
import Swal from "sweetalert2";

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
  const [completePaginate, setCompletePaginate] = useState();
  let pageLen = 9;

  const getFirebaseData = async () => {
    const data = await getActivityData();
    setData(data);
    allActivitiesArray.push(...data);
    allActivitiesArrayCopy.push(...data);

    //也顯示揪團主，待更改
    //   data.forEach(async (item, index) => {
    //     const eachHost = await getUserData(item.host).then((res) => {
    //       // hostDetailArray.push(res);
    //       data[index].host = res;

    //       return res;
    //     });
    //   });

    // setData(data);
    // allActivitiesArray.push(...data);
    // allActivitiesArrayCopy.push(...data);
  };
  //Promise.all(promises.then((result)=>{

  //   }))

  const handlePagination = () => {
    let allPageArray = [];

    let currentTime = Date.now();

    let openActivityArray = data.filter((item) => {
      return item.timestamp.toMillis() > currentTime;
    });

    const pageArray = openActivityArray.slice(0, pageLen);
    const pageNum = Math.ceil(openActivityArray.length / pageLen);
    setPageNum(pageNum);
    for (let i = 0; i < openActivityArray.length; i = i + pageLen) {
      let pageArray = openActivityArray.slice(i, i + pageLen);
      allPageArray.push(pageArray);
    }

    setAllPaginateArray(allPageArray);
    setCompletePaginate(true);
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
    if (userUid) {
      setUserDataUid(userUid);
      const userData = await getUserData(userUid);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // if (!data) {
  //   return "isLoading";
  // }
  // if (!data) {
  //   return "Loading";
  // }

  // if (!data || allPaginateArray.length <= 0) {
  //   return <div style={{ minHeight: `calc(100vh - 180px) ` }}>Loading</div>;
  // }

  const handleFilter = (e, filter) => {
    const selectType = document.querySelector("#selectType");
    const selectRequirement = document.querySelector("#selectRequirement");
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
        if (item.type.includes(e)) {
          return item;
        }
      });
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
        if (item.requirement.includes(e)) {
          return item;
        }
      });
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
  const handleCreateNow = () => {
    if (userDataUid) {
      return (
        <Link to={`/activities/create`}>
          <CreateNow>馬上開團</CreateNow>
        </Link>
      );
    } else {
      let LogInAlert = () => {
        Swal.fire({
          title: "<span style=font-size:24px>登入以使用此功能</span>",
          customClass: "customSwal2Title",
          background: "black",
          confirmButtonColor: "#43e8d8",
          confirmButtonText: "<span  style=color:#000>確定</span",
        });
      };
      return <CreateNow onClick={LogInAlert}>馬上開團</CreateNow>;
    }
  };
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

  const noActivitiesHTML = () => {
    if (allPaginateArray.length === 0) {
      return (
        <NoActivitiesContainer>
          <NoActivitiesImageContainer>
            <NoActivitiesImage src={neonGuitar1} />
          </NoActivitiesImageContainer>
          <NoActivities>無符合條件的活動~</NoActivities>
          {handleCreateNow()}
          {/* <JoinButton></JoinButton> */}
        </NoActivitiesContainer>
      );
    }
  };

  if (!completePaginate) {
    return <IsLoading />;
  }
  if (!data) {
    return <IsLoading />;
  }
  //filter不到活動會卡住
  // if (allPaginateArray.length === 0) {
  //   return <IsLoading />;
  // }

  const ActivityHTML =
    allPaginateArray.length > 0 ? (
      allPaginateArray[page - 1].map((item, index) => {
        let firebaseTime = item.timestamp.toMillis();
        let activityTime = item.timestamp.toDate().toString();
        let showTime = activityTime.slice(0, 21);
        let currentTime = Date.now();

        let requirementHTML = item.requirement.map((data) => {
          return <span key={data}>{data} </span>;
        });
        let attendantsNum = item.attendants.length;

        if (firebaseTime > currentTime) {
          return (
            <Animated
              animationIn="bounceInLeft"
              // animationOut="fadeOut"
              isVisible={true}
              animationInDelay={index * 100}
            >
              <Link to={`/activities/${item.id}`} key={index}>
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
            </Animated>
          );
        }
      })
    ) : (
      <NoResultContainer>
        {/* <NoResult>無符合條件的活動</NoResult> */}
        {noActivitiesHTML()}
      </NoResultContainer>
    );

  return (
    <MainContainer>
      <Carosul>
        {/* <MainImgContainer>
          <MainImg src={neonBand} alt="" />
        </MainImgContainer> */}
        <Animated
          animationIn="fadeInLeft"
          animationInDelay="500"
          // animationOut="fadeOut"
          isVisible={true}
        >
          <Slogan>
            整個城市<br></br>都是我的練團室
          </Slogan>
        </Animated>

        <Animated
          animationIn="fadeIn"
          animationInDelay="1500"
          // animationOut="fadeOut"
          isVisible={true}
        >
          <SubSlogan>遇見更多音樂同好、即刻成團</SubSlogan>
          <LearnMore>
            <LearnMoreSlogan>Learn More</LearnMoreSlogan>
            <ArrowRight src={arrowRight}></ArrowRight>
          </LearnMore>
        </Animated>

        <Animated
          animationIn="fadeIn"
          animationInDelay="500"
          // animationOut="fadeOut"
          isVisible={true}
        >
          <JoinButtonContainer>{sloganButtonHTML()}</JoinButtonContainer>
        </Animated>
      </Carosul>
      {/* <Neon data-text="成果牆">成果牆</Neon> */}
      {/* <div>
        <InstrumentBanner />
      </div> */}

      <ActivityFilter>
        <FilterTitle>篩選</FilterTitle>
        <FilterBar>
          <Filterlabel>類型</Filterlabel>
          <FilterSelect
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
          </FilterSelect>
        </FilterBar>
        <FilterBar>
          <Filterlabel>需求</Filterlabel>
          <FilterSelect
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
          </FilterSelect>
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
  background-color: #121212;
  /* background-color: #4e3a3a; */
  min-height: calc(100vh - 180px);
  padding-bottom: 50px;
`;

const Carosul = styled.div`
  height: 600px;
  /* background: black; */
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
  font-size: 66px;
  font-weight: bold;
  top: 50px;
  left: 120px;
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
  /* text-shadow: 0 0 5px rgba(255, 65, 65, 1), 0 0 10px rgba(255, 65, 65, 1),
    0 0 20px rgba(255, 65, 65, 1), 0 0 40px rgba(255, 65, 65, 1); */
  animation: ${NeonShine} 3s 1s linear infinite;
  @media (max-width: 768px) {
    left: 80px;
  }
  @media (max-width: 576px) {
    font-size: 36px;
    left: 60px;
  }
`;
const SubSlogan = styled.div`
  color: white;
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  top: 40%;
  left: 120px;
  line-height: 40px;
  @media (max-width: 768px) {
    left: 80px;
  }
  @media (max-width: 576px) {
    font-size: 16px;
    left: 60px;
    top: 47%;
  }
`;
const LearnMore = styled.div`
  color: white;
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  top: 47%;
  left: 120px;
  display: flex;
  @media (max-width: 768px) {
    left: 80px;
  }
  @media (max-width: 576px) {
    font-size: 16px;
    left: 60px;
    top: 57%;
  }
`;
const LearnMoreSlogan = styled.div``;
const ArrowRight = styled.img`
  text-align: center;

  width: 32px;
  @media (max-width: 576px) {
    width: 20px;
  }
`;

const JoinButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  top: 80%;
  @media (max-width: 576px) {
    top: 75%;
  }
`;
const JoinButton = styled.button`
  border-radius: 30px;
  /* background: #43e8d8; */
  /* background: #ff00ff; */
  border: 3px solid #43e8d8;

  padding: 12px 60px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  color: white;
  text-shadow: 0 0 5px #43e8d8, 0 0 10px #43e8d8, 0 0 20px #43e8d8,
    0 0 40px #43e8d8;
  box-shadow: 0 0 20px #43e8d8, inset 0 0 20px #43e8d8;
  &:hover {
    border: 3px solid #4cffee;

    background: #4cffee;
    box-shadow: 0 0 30px #4cffee;
    color: black;

    transform: translateY(-2px);
  }
  @media (max-width: 576px) {
    font-size: 16px;
    padding: 12px 48px;
  }
`;
const MainImgContainer = styled.div`
  width: 500px;
  height: 500px;
  position: absolute;
  right: 50px;
  top: 50px;
`;
const MainImg = styled.img`
  max-width: 100%;
  height: 100%;
  object-fit: cover;

  /* object-fit: cover; */
`;

const ActivityFilter = styled.div`
  display: flex;
  margin: 50px auto;
  /* margin-top: 20px; */
  max-width: 1024px;
  justify-content: flex-end;
  padding: 0 20px;
  color: white;

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
const FilterSelect = styled.select`
  cursor: pointer;
`;
const FilterBar = styled.div`
  border: 1px solid white;
  height: 33px;

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
  grid-row-gap: 40px;
  /* flex-wrap: wrap; */
  margin: 0 auto;
  margin: 0 auto;
  max-width: 1024px;
  justify-items: center;
  position: relative;
  min-height: 960px;
  /* align-items: center; */
  /* justify-content: space-around; */

  @media (max-width: 985px) {
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    grid-column-gap: 0px;
    grid-row-gap: 40px;
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
  /* border: 1px solid #979797; */
  width: 300px;
  height: 300px;
  border-radius: 4px;
  background: #000;
  /* margin-bottom: 40px; */
  /* text-align: left; */
  /* padding-top: 20px;
  padding-left: 30px; */
  line-height: 30px;
  color: #fff;
  align-items: center;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;

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
  border-radius: 4px;

  background: rgba(0, 0, 0, 0.6);
  /* &:hover {
    background: rgba(0, 0, 0, 0.8);
    color: black;
    transform: scale(1.05);
  } */
  pointer-events: none;
  /* z-index: -1; */

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ActivityContent = styled.div`
  border: 1px solid #979797;
  margin: 10px 10px;
  padding: 10px;
  position: relative;
  @media (max-width: 768px) {
    /* margin-top: 10px;
    margin-left: 20px; */
    max-height: 180px;
    /* text-align: left; */
  }
`;
const NoResultContainer = styled.div`
  position: absolute;
  width: 200px;
  text-align: center;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const NoResult = styled.div`
  font-size: 20px;
`;
const PageControllContainer = styled.div`
  margin: 30px auto;
  max-width: 1024px;
  display: flex;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  height: 60px;
`;
const Time = styled.div`
  font-size: 16px;
  font-weight: 300;
`;
const Type = styled.div`
  font-size: 16px;
`;
const Requirement = styled.div`
  font-size: 16px;
  margin-top: 10px;
  height: 60px;
  @media (max-width: 768px) {
    font-size: 16px;
    height: unset;
  }
`;
const Location = styled.div`
  height: 40px;
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
    bottom: 10px;
    font-size: 16px;
  }
`;
const ActivityImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  /* background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)); */

  transition: all 0.5s ease 0s;
  &:hover {
    transform: scale(1.2);
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

const NoActivitiesContainer = styled.div`
  margin: 20px auto;
  width: 150px;
  position: relative;
`;
const NoActivitiesImageContainer = styled.div`
  width: 50px;
`;
const NoActivitiesImage = styled.img`
  width: 100%;
  transform: rotate(0.125turn);
`;

const NoActivities = styled.div`
  position: absolute;
  top: 70px;
  right: -10px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
`;
const CreateNow = styled.button`
  padding: 6px 10px;
  border: 1px solid #ff00ff;
  border-radius: 8px;
  background: #ff00ff;
  color: #fff;
  font-weight: 600;
  position: absolute;
  top: 100px;
  left: 25px;
  /* text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff; */
  box-shadow: 0 0 5px #ff00ff;

  transition: 0.3s;
  cursor: pointer;
  &:hover {
    /* background: #fff05c; */
    background: #ff00ff;
    box-shadow: 0 0 10px #ff00ff;

    color: white;
    transform: translateY(-2px);
  }
`;

export default Main;
