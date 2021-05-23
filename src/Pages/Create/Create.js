import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import MyComponent from "../../Map";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MultiSelect from "react-multi-select-component";
import { uploadImage } from "../../utils/firebase";
import { createActivity } from "../../utils/firebase";

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
let checked = false;

function Create() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  // const [limit, setLimit] = useState("");
  const [level, setLevel] = useState("");
  const [checked, setChecked] = useState(false);
  let limit = 0;
  let comment = "";
  let youtubeUrl = "";
  let imgSource = "";
  let imageUrl = "";

  //   const [requirement, setRequirement] = useState("");
  const host = "vfjMHzp45ckI3o3kqDmO";

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

    let newTimestamp = new Date(`${date}T${time}`);

    // const uploadImage = async () => {
    //   const path = imgSource.name;

    //   // 取得 storage 對應的位置
    //   const storageReference = window.firebase.storage().ref(path);
    //   // .put() 方法把東西丟到該位置裡
    //   const task = await storageReference.put(imgSource);
    //   const fileRef = window.firebase.storage().ref(path);

    //   let downloadUrl = await fileRef.getDownloadURL().then(function (url) {
    //     return url;
    //   });
    //   imageUrl = await downloadUrl;
    // };
    imageUrl = await uploadImage(imgSource);
    console.log(imageUrl);

    const activityData = db.collection("activityData").doc();

    let newData = {
      id: activityData.id,
      title: title,
      type: type,
      limit: limit,
      newTimestamp: newTimestamp, //改這個存放到redux才不會有問題
      timestamp: timestamp, //firebase內建timestamp
      location: "AppWork School 3F",
      geo: ["10", "10"],
      requirement: requirementArray,
      level: level,
      host: host, //or id?
      attendants: [],
      applicants: [],
      comment: comment,
      youtubeSource: youtubeUrl,
      fileSource: imageUrl,
      status: true,
      date: date,
      time: time,
    };

    await activityData.set(newData);
    window.location.replace("./");
    console.log("???????");
  };

  const [requirement, setRequirement] = useState([]);
  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
  ];

  let requirementArray = [];
  requirement.forEach((data) => {
    requirementArray.push(data.value);
  });

  function handleChange(e, changeType) {
    if (changeType === "title") {
      setTitle(e.target.value);
      console.log(e.target.value);
    }
    if (changeType === "date") {
      setDate(e.target.value);
    }
    if (changeType === "time") {
      setTime(e.target.value);
    }
    if (changeType === "type") {
      setType(e.target.value);
    }
    if (changeType === "level") {
      setLevel(e.target.value);
    }
  }

  const LimitboxHTML = () => {
    if (checked) {
      return (
        <div>
          <Inputfield
            type="number"
            defaultValue=""
            disabled={checked}
            onChange={(e) => {
              limit = e.target.value;
            }}
          ></Inputfield>
        </div>
      );
    } else {
      return (
        <div>
          <Inputfield
            type="number"
            defaultValue="1"
            min="1"
            max="20"
            onChange={(e) => {
              limit = e.target.value;
            }}
          ></Inputfield>
        </div>
      );
    }
  };

  function handleUploadImage(e) {
    imgSource = e.target.files[0];
  }

  return (
    <Container>
      this is create page
      <div>我要創團</div>
      <div>
        <Label>活動名稱</Label>
        <Inputfield
          onChange={(e) => {
            handleChange(e, "title");
          }}
        ></Inputfield>
      </div>
      <div>
        <Label>日期</Label>
        <Inputfield
          type="date"
          onChange={(e) => {
            handleChange(e, "date");
          }}
        ></Inputfield>
      </div>
      <div>
        <Label>時間</Label>
        <Inputfield
          type="time"
          onChange={(e) => {
            handleChange(e, "time");
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
            handleChange(e, "type");
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
        <MultiSelect
          options={options}
          value={requirement}
          onChange={setRequirement}
          labelledBy="Select"
        />
      </div>
      <LimitDiv>
        <label>人數限制</label>
        {/* <Inputfield
          type="number"
          defaultValue="1"
          min="1"
          max="20"
          id="limitValue"
          onChange={(e) => {
            setLimit(e.target.value);
          }}
        ></Inputfield> */}
        <LimitboxHTML></LimitboxHTML>
        <input
          type="checkbox"
          id="noLimit"
          onChange={() => setChecked(!checked)}
        />
        {/* <input
          type="checkbox"
          id="noLimit"
          onChange={(e) => {
            console.dir(e);
            if (e.target.checked) {
              setLimit("none");
              console.log(limit);
              const ttt = document.querySelector("#limitValue");
              ttt.disabled = true;
              ttt.value = "";
            }
          }}
        /> */}
        <label for="noLimit">無</label>
      </LimitDiv>
      <div>
        <Label>建議程度</Label>
        <Inputfield
          placeholder="請描述"
          onChange={(e) => {
            handleChange(e, "level");
          }}
        ></Inputfield>
      </div>
      <div>
        <label>地點</label>
        <Inputfield class="location"></Inputfield>
      </div>
      <div>
        <label>備註</label>
        <Inputfield
          onChange={(e) => {
            comment = e.target.value;
          }}
        ></Inputfield>
      </div>
      <div>
        <label>上傳活動照片</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleUploadImage(e);
          }}
        ></input>
      </div>
      <div>
        <label>上傳Youtube連結</label>
        <Inputfield
          type="url"
          onChange={(e) => {
            youtubeUrl = e.target.value;
          }}
        ></Inputfield>
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
  height: 100vh;
`;

const Inputfield = styled.input`
  border: 1px solid #979797;
`;

const LimitDiv = styled.div`
  display: flex;
`;
const Label = styled.label`
  width: 120px;
  display: inline-block;
`;

const Button = styled.button`
  border: 1px solid #979797;
`;
export default Create;
