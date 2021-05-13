import "./App.css";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import MyComponent from "./Map";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// var firebaseConfig = {
//   apiKey: "AIzaSyDEsAz0oLPwZ-JQbDGGnq3CQAJK1d7714k",
//   authDomain: "personalproject-33263.firebaseapp.com",
//   projectId: "personalproject-33263",
//   storageBucket: "personalproject-33263.appspot.com",
//   messagingSenderId: "966021952087",
//   appId: "1:966021952087:web:5c52cfb31b031cdf6a6912",
//   measurementId: "G-MXQWY9WWZK",
// };

// window.firebase.initializeApp(firebaseConfig);

const db = window.firebase.firestore();
console.log(db);
function Create() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [limit, setLimit] = useState("");
  const [level, setLevel] = useState("");
  const [requirement, setRequirement] = useState("");
  const host = "user123";

  const refContainer = useRef("");

  const convertDateTime = () => {
    let formatDateYear = date.slice(0, 4);
    let formatDateMonth = date.slice(5, 7);
    let formatDateDate = date.slice(8, 10);
    let formatTimeHour = time.slice(0, 2);
    let formatTimeSecond = time.slice(3, 5);

    return {
      formatDateYear,
      formatDateMonth,
      formatDateDate,
      formatTimeHour,
      formatTimeSecond,
    };
  };

  const clickCreate = async () => {
    console.log("click");
    convertDateTime();
    let timestamp = new Date(
      convertDateTime().formatDateYear,
      convertDateTime().formatDateMonth - 1,
      convertDateTime().formatDateDate,
      convertDateTime().formatTimeHour,
      convertDateTime().formatTimeSecond
    );
    console.log(timestamp);
    console.log(time);

    console.log(new Date(1620864000000));
    console.log(new Date(date));
    console.log(type);

    let newData = {
      id: 5,
      title: title,
      type: type,
      limit: limit,
      timestamp: timestamp, //firebase內建timestamp
      location: "AppWork School 3F",
      geo: ["10", "10"],
      requirement: ["vocal", "guitar"],
      level: level,
      host: host, //or id?
      attendents: [],
      appliers: [],
      comment: "帶零食",
      youtubeSource: "youtube url",
      fileSource: "",
      status: true,
    };

    // const activityData = db.collection("activityData").doc();
    // await activityData.set(newData);
  };

  return (
    <Container>
      this is create page
      <div>我要創團</div>
      <div>
        <Label>活動名稱</Label>
        <Inputfield
          ref={refContainer}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></Inputfield>
      </div>
      <div>
        <Label>日期</Label>
        <Inputfield
          type="date"
          onChange={(e) => {
            setDate(e.target.value);
          }}
        ></Inputfield>
      </div>
      <div>
        <Label>時間</Label>
        <Inputfield
          type="time"
          onChange={(e) => {
            setTime(e.target.value);
          }}
        ></Inputfield>
      </div>
      <div>
        <Label>音樂類型</Label>
        {/* <Inputfield
          onChange={(e) => {
            setType(e.target.value);
          }}
        ></Inputfield> */}
        <select
          onChange={(e) => {
            setType(e.target.value);
            console.log(type);
          }}
        >
          <option value="" disabled selected>
            請選擇主要曲風
          </option>
          <option>流行</option>
          <option>嘻哈</option>
          <option>古典</option>
        </select>
      </div>
      <div>
        <Label>樂器需求</Label>
        <Inputfield
          onChange={(e) => {
            setRequirement(e.target.value);
          }}
        ></Inputfield>
      </div>
      <div>
        <label>人數限制</label>
        <Inputfield
          type="number"
          defaultValue="1"
          min="1"
          max="20"
          onChange={(e) => {
            setLimit(e.target.value);
          }}
        ></Inputfield>
        <input type="checkbox" id="noLimit" />
        <label for="noLimit">無</label>
      </div>
      <div>
        <Label>建議程度</Label>
        <Inputfield
          onChange={(e) => {
            setLevel(e.target.value);
          }}
        ></Inputfield>
      </div>
      <div>
        <label>地點</label>
        <Inputfield class="location"></Inputfield>
      </div>
      <div>
        <label>上傳活動照片</label>
        <input type="file" accept="image/*"></input>
      </div>
      <div>
        <label>上傳Youtube連結</label>
        <Inputfield type="url"></Inputfield>
      </div>
      <Button
        class="createBtn"
        onClick={() => {
          clickCreate();
        }}
      >
        建立活動
      </Button>
    </Container>
  );
}

const Container = styled.div`
  text-align: start;
  width: 480px;
  margin: 0 auto;
`;

const Inputfield = styled.input`
  border: 1px solid #979797;
`;
const Label = styled.label`
  width: 120px;
  display: inline-block;
`;

const Button = styled.button`
  border: 1px solid #979797;
`;
export default Create;
