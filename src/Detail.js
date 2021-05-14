import "./App.css";
// import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificData } from "./utils/firebase";
import { joinActivity } from "./utils/firebase";
import { getUserData } from "./utils/firebase";

function Detail() {
  let { id } = useParams();
  let userId = "vfjMHzp45ckI3o3kqDmO";
  const [detailData, setDetailData] = useState();

  let activityDetail = {};

  const getData = async () => {
    let data = await getSpecificData(id);
    // activityDetail = data;
    console.log(data);

    //再打一次userData, 取得 host 的userData詳細資料，放進detailData 裡面以便之後取用
    console.log(data.host);
    const host = await getUserData(data.host);
    console.log(host);
    // console.log(data.applicants);
    // const applicants = data.applicants.map(async (data) => {
    //   const eachData = await getUserData(data);
    //   console.log(eachData);
    //   return eachData;
    // });
    // console.log(applicants);

    //打多次userData, 一次取得多個 applicants 的userData詳細資料，放進detailData 裡面以便之後取用
    const applicantsDetailArray = [];
    data.applicants.forEach((applicants) => {
      const promise = getUserData(applicants).then((data) => {
        console.log(data);
        return data;
      });
      applicantsDetailArray.push(promise);
    });
    const allApplicants = await Promise.all(applicantsDetailArray);
    console.log(allApplicants);
    //把有detail的host & applicants塞到useState
    data.host = host;
    data.applicants = allApplicants;
    console.log(data);
    // host = data.host;
    setDetailData(data);
    console.log(detailData);
  };

  console.log(detailData);
  //   const detailHTML = detailData.() => {
  //     return <div></div>;
  //   };

  const renderDetail = () => {
    console.log("??");
    let requirementHTML = detailData.requirement.map((item, index) => {
      return <span>{item} </span>;
    });
    let activityTime = detailData.timestamp.toDate().toString();
    console.log(activityTime.slice(0, 24));

    return (
      <div>
        <div>{detailData.title}</div>
        <div>{detailData.type}</div>
        <div>{detailData.comment}</div>
        {/* <div>{detailData.timestamp}</div> */}
        <div>需求樂器： {requirementHTML}</div>
        <div>適合程度： {detailData.level}</div>
        <div>人數限制： {detailData.limit}</div>
        <div>地點： {detailData.location}</div>
        <img src={`${detailData.fileSource}`} alt=""></img>
        <div>{detailData.id}</div>
      </div>
    );
  };

  const userData = async () => {
    console.log("!!");
    let data = await getUserData(userId);
    console.log(data);
  };

  userData();

  const renderHost = async () => {
    console.log(detailData.host);
  };
  const handleJoin = () => {
    console.log("join click!");

    joinActivity(id, userId);
  };

  //useEffect只在第一次render後執行
  useEffect(() => {
    getData();
  }, []);

  //useEffect在每次detailData變化後執行
  //   useEffect(() => {
  //     renderDetail();
  //   }, [detailData]);

  //防止第一次render抓不到東西，先return null跳出 (幫下面的renderDetail擋避免undifine)
  if (!detailData) {
    return "isLoading";
  }
  return (
    <div>
      this is detail page
      {renderDetail()}
      <button
        onClick={() => {
          handleJoin();
        }}
      >
        我要報名
      </button>
    </div>
  );
}

export default Detail;
