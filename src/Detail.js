import "./App.css";
import styled from "styled-components";
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

    //再打一次userData, 取得 host 的userData詳細資料，放進detailData 裡面以便之後取用
    const host = await getUserData(data.host);

    //打多次userData, 一次取得多個 applicants 的userData詳細資料，放進detailData 裡面以便之後取用
    const applicantsDetailArray = [];
    data.applicants.forEach((applicants) => {
      const promise = getUserData(applicants).then((data) => {
        return data;
      });
      applicantsDetailArray.push(promise);
    });
    const allApplicants = await Promise.all(applicantsDetailArray);

    //把有detail的host & applicants塞到useState
    data.host = host;
    data.applicants = allApplicants;

    setDetailData(data);
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
    let limit = "";
    if (detailData.limit === 0) {
      limit = "無";
    } else {
      limit = detailData.limit;
    }

    return (
      <ActivityContainer>
        <ActivityDetail>
          <div>{detailData.title}</div>
          <div>{detailData.type}</div>
          <div>{detailData.comment}</div>
          {/* <div>{detailData.timestamp}</div> */}
          <div>需求樂器： {requirementHTML}</div>
          <div>適合程度： {detailData.level}</div>
          <div>人數限制： {limit}</div>
          <div>地點： {detailData.location}</div>
          <div>{detailData.id}</div>
        </ActivityDetail>
        <ImageContainer>
          <ActivityImage
            src={`${detailData.fileSource}`}
            alt=""
          ></ActivityImage>
        </ImageContainer>
      </ActivityContainer>
    );
  };

  //   const userData = async () => {
  //     console.log("!!");
  //     let data = await getUserData(userId);
  //     console.log(data);
  //   };

  //   userData();

  const renderHost = () => {
    console.log(detailData.host.name);
    console.log(detailData.applicants);
    const applicantsHTML = Object.values(detailData.applicants).map((data) => {
      console.log(data);
      console.log(data.name);
      return <div>{data.name}</div>;
    });
    return (
      <div>
        <div>揪團主</div>
        <div>{detailData.host.name}</div>
        <div>出席成員</div>
        {applicantsHTML}
      </div>
    );

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
      <JoinButton
        onClick={() => {
          handleJoin();
        }}
      >
        我要報名
      </JoinButton>
      {renderHost()}
    </div>
  );
}

const ActivityContainer = styled.div`
  width: 960px;
  display: flex;
  margin: 0 auto;
`;
const ActivityDetail = styled.div`
  width: 480px;
`;
const ImageContainer = styled.div`
  /* width: calc(100%-480px); */
  width: 360px;
`;
const ActivityImage = styled.img`
  width: 100%;
`;
const JoinButton = styled.button`
  border: 1px solid #979797;
  padding: 5px;
  cursor: pointer;
`;
export default Detail;
