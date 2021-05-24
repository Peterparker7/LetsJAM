// import "../../App.css";
import "../../normalize.css";
import "./Create.css";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import MyComponent from "../../Map";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MultiSelect from "react-multi-select-component";
import { uploadImage } from "../../utils/firebase";
import { createActivity } from "../../utils/firebase";
import exampleImg from "../../images/startgroupexample.png";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

const db = window.firebase.firestore();
let checked = false;

function Create() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [limit, setLimit] = useState("");
  const [level, setLevel] = useState("");
  const [checked, setChecked] = useState(false);
  // let limitinit = 0;
  let comment = "";
  let youtubeUrl = "";
  let imgSource = "";
  let imageUrl = "";

  const userDataRedux = useSelector((state) => state.userData);

  //   const [requirement, setRequirement] = useState("");
  // const host = "vfjMHzp45ckI3o3kqDmO";
  const host = userDataRedux.uid;
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
    if (checked) {
      setLimit(0);
    }
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
    if (changeType === "limit") {
      setLimit(e.target.value);
    }
  }

  const LimitboxHTML = () => {
    if (checked) {
      return (
        <div>
          <LimitInputField
            type="number"
            defaultValue=""
            disabled={checked}
            style={{ opacity: 0.3 }}
            onChange={(e) => {
              // limitinit = e.target.value;
              // handleChange(e, "limit");
            }}
          />
        </div>
      );
    } else {
      return (
        <div>
          <LimitInputField
            type="number"
            defaultValue={limit}
            min="1"
            max="20"
            onChange={(e) => {
              // limitinit = e.target.value;
              // setLimit(e.target.value);
              handleChange(e, "limit");
            }}
          />
        </div>
      );
    }
  };

  function handleUploadImage(e) {
    imgSource = e.target.files[0];
  }

  return (
    <Container>
      <ProcessIntroContainer>
        <ProcessIntro>創立活動圖文說明</ProcessIntro>
        <img src={`${exampleImg}`} alt="" style={{ width: "900px" }} />
      </ProcessIntroContainer>
      <CreateDetailContainer>
        <Title>我要創團</Title>
        <CreateDetail>
          <InputFieldDiv>
            <Label>活動名稱</Label>
            <Inputfield
              onChange={(e) => {
                handleChange(e, "title");
              }}
            ></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>日期</Label>
            <Inputfield
              type="date"
              onChange={(e) => {
                handleChange(e, "date");
              }}
            ></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>時間</Label>
            <Inputfield
              type="time"
              onChange={(e) => {
                handleChange(e, "time");
              }}
            ></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
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
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>樂器需求</Label>
            <MultiSelect
              options={options}
              value={requirement}
              onChange={setRequirement}
              labelledBy="Select"
            />
          </InputFieldDiv>
          <InputFieldDiv>
            <LimitDiv>
              <Label>人數限制</Label>
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
              <LimitCheckBoxField
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
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>建議程度</Label>
            <Inputfield
              placeholder="請描述"
              onChange={(e) => {
                handleChange(e, "level");
              }}
            ></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>地點</Label>
            <Inputfield class="location"></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>備註</Label>
            <Inputfield
              onChange={(e) => {
                comment = e.target.value;
              }}
            ></Inputfield>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>上傳活動照片</Label>
            <input
              type="file"
              accept="image/*"
              style={{ width: "200px" }}
              onChange={(e) => {
                handleUploadImage(e);
              }}
            ></input>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>上傳Youtube連結</Label>
            <Inputfield
              type="url"
              onChange={(e) => {
                youtubeUrl = e.target.value;
              }}
            ></Inputfield>
          </InputFieldDiv>
        </CreateDetail>
        <ButtonField>
          <Button
            class="createBtn"
            onClick={() => {
              clickCreate();
            }}
          >
            建立活動
          </Button>
        </ButtonField>
      </CreateDetailContainer>
    </Container>
  );
}

const Container = styled.div`
  text-align: left;
  width: 1024px;
  margin: 50px auto;
  height: 100%;
  border: 1px solid;
`;
const ProcessIntroContainer = styled.div`
  width: 960px;
  height: 400px;
  margin: 0 auto;
`;
const ProcessIntro = styled.div``;
const CreateDetailContainer = styled.div`
  width: 720px;
  margin: 0 auto;
  margin-bottom: 20px;
`;
const CreateDetail = styled.div`
  line-height: 30px;
  padding: 20px;
`;
const Title = styled.div`
  font-size: 24px;
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const InputFieldDiv = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  /* text-align: center; */
`;
const Inputfield = styled.input`
  border: 1px solid #979797;
  width: 200px;
  height: 30px;
  padding: 5px;
`;
const LimitInputField = styled.input`
  width: 50px;
  height: 30px;
  padding: 5px;
  border: 1px solid #979797;
`;
const LimitCheckBoxField = styled.input`
  width: 30px;
`;

const LimitDiv = styled.div`
  display: flex;
  align-items: center;
`;
const Label = styled.label`
  width: 130px;
  display: inline-block;
`;
const ButtonField = styled.div`
  text-align: center;
`;
const Button = styled.button`
  border: 1px solid #979797;
  padding: 5px;
  border-radius: 10px;
  width: 90px;
  height: 40px;
  cursor: pointer;
`;
export default Create;
