// import "../../App.css";
import "../../normalize.css";
import "./Create.css";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import MyComponent from "../../Map";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MultiSelect from "react-multi-select-component";
import { uploadImage, getAuthUser } from "../../utils/firebase";
import exampleImg from "../../images/startgroupexample.png";
import concertImg from "../../images/concert1.jpg";
import { useSelector } from "react-redux";

import CreateDetailForm from "./Formik";
import * as Warning from "./Warning";
import UsePlace from "./UsePlace";
import Place from "./Place";

import CircularIndeterminate from "./CircularProgress";

const db = window.firebase.firestore();
// let checked = false;

const StyledMultiSelect = styled(MultiSelect)`
  border-bottom: 1px solid #979797;
  --rmsc-border: unset !important;
`;

function Create(props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("流行");
  const [limit, setLimit] = useState("");
  const [imgUrl, setimgUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/personalproject-33263.appspot.com/o/travis-yewell-F-B7kWlkxDQ-unsplash.jpg?alt=media&token=f3254958-e279-4e31-8175-faea930a1532"
  );
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");
  const [checked, setChecked] = useState(true);
  const [place, setPlace] = useState("");

  const [titleStatus, setTitleStatus] = useState(true);
  const [dateStatus, setDateStatus] = useState(true);
  const [timeStatus, setTimeStatus] = useState(true);
  const [typeStatus, setTypeStatus] = useState(true);
  const [requirementStatus, setRequirementStatus] = useState(true);
  const [limitStatus, setLimitStatus] = useState(true);
  const [levelStatus, setLevelStatus] = useState(true);
  const [locationStatus, setLocationStatus] = useState(true);
  const [placeStatus, setPlaceStatus] = useState(true);
  const [imageStatus, setImageStatus] = useState(true);
  // const [userUid, setUserUid] = useState();

  const [requirement, setRequirement] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();
  // let limitinit = 0;
  // let comment = "";
  let youtubeUrl = "";
  let imgSource = "";
  let imageUrl = "";

  const userDataRedux = useSelector((state) => state.userData);

  //   const [requirement, setRequirement] = useState("");
  // const host = "vfjMHzp45ckI3o3kqDmO";
  const host = userDataRedux.uid;
  const refContainer = useRef("");

  function addDays(date, days) {
    if (days === 0) {
      let result = new Date(date);
      result.setDate(result.getDate() + 7);
      return result;
    }
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  let nowDate = new Date();
  // console.log(nowDate.getDay());
  // let sat = nowDate.addDays(6 - nowDate.getDay());
  // console.log(sat);

  let sat = addDays(nowDate, 6 - nowDate.getDay())
    .toISOString()
    .substr(0, 10);

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

  // const checkUserIsLogin = async () => {
  //   const userUid = await getAuthUser();
  //   setUserUid(userUid);
  //   if (!userUid) {
  //     history.push("/");
  //     return "redirection";
  //   }
  // };

  useEffect(() => {
    // checkUserIsLogin();
    setDate(sat);
    setTime("16:00");
  }, []);

  if (props.userUid === "") {
    return null;
  } else if (!props.userUid) {
    history.push("/");
    return "redirection";
  }

  const createFormCheck = () => {
    let nowDate = Date.now();
    let a = time.split(":");
    let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
    let deviation = 8 * 60 * 60000;
    console.log(nowDate);
    console.log(Date.parse(date) + milliseconds - deviation);
    console.log(timeStatus);
    console.log(dateStatus);

    if (!title || title.length > 10) {
      setTitleStatus(false);
    }
    if (!date || nowDate >= Date.parse(date) + 16 * 60 * 60000) {
      setDateStatus(false);
    }
    if (!time || nowDate >= Date.parse(date) + milliseconds - deviation) {
      setTimeStatus(false);
    }
    if (!type) {
      setTypeStatus(false);
    }
    if (requirement.length === 0) {
      setRequirementStatus(false);
    }
    if (!limit && !checked) {
      setLimitStatus(false);
    }
    // if (!level) {
    //   setLevelStatus(false);
    // }
    if (!place) {
      setPlaceStatus(false);
    }
    if (!imgUrl) {
      setImageStatus(false);
    }
    if (
      !titleStatus ||
      !dateStatus ||
      !timeStatus ||
      !typeStatus ||
      requirement.length === 0 ||
      !limitStatus ||
      !placeStatus ||
      !imgUrl
    ) {
      console.log("Validation fail");
      return false;
    } else {
      return true;
    }
  };

  const clickCreate = async () => {
    if (checked) {
      setLimit(0);
    }
    console.log(time);
    console.log(date);
    console.log(type);
    console.log(place);
    console.log(location);
    console.log(limit);
    convertDateTime();
    let timestamp = new Date(
      convertDateTime().formatDateYear,
      convertDateTime().formatDateMonth - 1,
      convertDateTime().formatDateDate,
      convertDateTime().formatTimeHour,
      convertDateTime().formatTimeSecond
    );

    let newTimestamp = new Date(`${date}T${time}`);

    // imageUrl = await uploadImage(imgSource);

    const activityData = db.collection("activityData").doc();

    let newData = {
      id: activityData.id,
      title: title,
      type: type,
      limit: limit,
      newTimestamp: newTimestamp, //改這個存放到redux才不會有問題
      timestamp: timestamp, //firebase內建timestamp
      location: place,
      geo: ["10", "10"],
      requirement: requirementArray,
      level: level,
      host: host, //or id?
      attendants: [],
      applicants: [],
      comment: comment,
      youtubeSource: youtubeUrl,
      fileSource: imgUrl,
      status: true,
      date: date,
      time: time,
    };

    if (createFormCheck()) {
      await activityData.set(newData);
      window.location.replace("./");
    }
  };

  let override = {
    allItemsAreSelected: "我全都要",
    clearSearch: "Clear Search",
    noOptions: "No options",
    search: "搜尋",
    selectAll: "全選",
    selectSomeItems: "請選擇樂器",
  };
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

  if (!userDataRedux) {
    return "isloading";
  }
  // if (!userUid) {
  //   return "isLoading";
  // }
  function handleChange(e, changeType) {
    let nowDate = Date.now();
    let deviation = 8 * 60 * 60000;

    if (changeType === "title") {
      setTitle(e.target.value);
      setTitleStatus(true);
    }
    if (changeType === "date") {
      setDate(e.target.value);
      setDateStatus(true);
      if (nowDate >= Date.parse(e.target.value) + 16 * 60 * 60000) {
        setDateStatus(false);
      }
    }
    if (changeType === "time") {
      let a = e.target.value.split(":");
      let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;

      setTime(e.target.value);
      setTimeStatus(true);
      if (nowDate >= Date.parse(date) + milliseconds - deviation) {
        setTimeStatus(false);
      }
    }
    if (changeType === "type") {
      setType(e.target.value);
      setTypeStatus(true);
    }
    if (changeType === "level") {
      setLevel(e.target.value);
      // setLevelStatus(true);
    }
    if (changeType === "limit") {
      setLimit(e.target.value);
      setLimitStatus(true);
    }
    if (changeType === "location") {
      setLocation(e.target.value);
      setLocationStatus(true);
    }
    if (changeType === "comment") {
      setComment(e.target.value);
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

  async function handleUploadImage(e) {
    setIsLoading(true);
    if (e.target.value) {
      imgSource = e.target.files[0];
      // console.log(imgSource);
      imageUrl = await uploadImage(imgSource);
      setIsLoading(false);

      setimgUrl(imageUrl);
      console.log(imageUrl);
    }
  }

  return (
    <MainContainer>
      <Container>
        {/* <ProcessIntroContainer> */}
        {/* <ProcessIntro>創立活動圖文說明</ProcessIntro> */}
        {/* <img src={`${exampleImg}`} alt="" style={{ width: "900px" }} /> */}
        {/* </ProcessIntroContainer> */}
        <CreateDetailContainer>
          <CreateDetailTopBar></CreateDetailTopBar>
          <Title>我要開團</Title>
          <CreateDetail>
            <CreateDetailContent>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>活動名稱</Label>
                <Inputfield
                  name="title"
                  placeholder="請輸入活動名稱 最多10字"
                  onChange={(e) => {
                    handleChange(e, "title");
                  }}
                ></Inputfield>
                {Warning.warningTitleHTML(title, titleStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>日期</Label>
                <Inputfield
                  defaultValue={sat}
                  type="date"
                  onChange={(e) => {
                    handleChange(e, "date");
                  }}
                ></Inputfield>
                {Warning.warningDateHTML(date, dateStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>時間</Label>
                <Inputfield
                  defaultValue="16:00:00"
                  type="time"
                  onChange={(e) => {
                    handleChange(e, "time");
                  }}
                  step={300}
                ></Inputfield>
                {Warning.warningTimeHTML(date, time, timeStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <Label>音樂類型</Label>
                {/* <Inputfield
          onChange={(e) => {
            setType(e.target.value);
          }}
        ></Inputfield> */}
                <SelectType
                  onChange={(e) => {
                    handleChange(e, "type");
                  }}
                >
                  {/* <option value="" disabled selected>
                    請選擇主要曲風
                  </option> */}
                  <option>流行</option>
                  <option>嘻哈</option>
                  <option>古典</option>
                </SelectType>
                {Warning.warningTypeHTML(type, typeStatus)}
              </InputFieldDiv>

              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>樂器需求</Label>
                <StyledMultiSelect
                  className="createPageMultiSelect"
                  options={options}
                  value={requirement}
                  overrideStrings={override}
                  onChange={(value) => {
                    setRequirement(value);
                    setRequirementStatus(true);
                  }}
                  labelledBy="Select"
                />
                {Warning.warningRequirementHTML(requirement, requirementStatus)}
              </InputFieldDiv>

              <InputFieldDiv>
                <LimitDiv>
                  <Label>人數限制</Label>
                  <LimitboxHTML></LimitboxHTML>
                  <LimitCheckBoxField
                    checked={checked}
                    type="checkbox"
                    id="noLimit"
                    onChange={() => {
                      setChecked(!checked);
                      setLimitStatus(true);
                      console.log(checked);
                      //第一次按下還沒有值，在這邊先設定不然到送出時limit會是空的
                      if (!checked) {
                        setLimit(0);
                      }
                    }}
                  />

                  <label htmlFor="noLimit">無</label>
                </LimitDiv>
                {Warning.warningLimitHTML(limit, limitStatus)}
              </InputFieldDiv>

              <InputFieldDiv>
                <Label>建議程度</Label>
                <Inputfield
                  placeholder="請描述 如：初階/進階"
                  onChange={(e) => {
                    handleChange(e, "level");
                  }}
                ></Inputfield>
                {/* {Warning.warningLevelHTML(level, levelStatus)} */}
              </InputFieldDiv>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>地點</Label>
                {/* <Inputfield
                  defaultValue={place}
                  placeholder="請輸入詳細地址"
                  class="location"
                  onChange={(e) => {
                    handleChange(e, "location");
                  }}
                ></Inputfield> */}
                <Place setPlace={setPlace} setPlaceStatus={setPlaceStatus} />
                {Warning.warningLocationHTML(place, placeStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <Label>活動備註</Label>
                <InputTextArea
                  placeholder={"請填活動說明"}
                  onChange={(e) => {
                    handleChange(e, "comment");
                    // comment = e.target.value;
                  }}
                ></InputTextArea>
              </InputFieldDiv>
              <InputFieldDiv>
                <Label>活動封面</Label>
                <InputfieldImage
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleUploadImage(e);
                    if (e.target.value) {
                      setImageStatus(true);
                    } else {
                      setImageStatus(false);
                    }
                  }}
                ></InputfieldImage>
                {Warning.warningImageHTML(imageUrl, imageStatus)}
              </InputFieldDiv>

              {/* <InputFieldDiv>
                <Label>上傳Youtube連結</Label>
                <Inputfield
                  type="url"
                  onChange={(e) => {
                    youtubeUrl = e.target.value;
                  }}
                ></Inputfield>
              </InputFieldDiv> */}
            </CreateDetailContent>
            <CreateDetailImageContainer>
              <CreateDetailImage src={imgUrl} />
            </CreateDetailImageContainer>
          </CreateDetail>
          <ButtonField>
            <Button
              style={
                !isLoading ? { display: "inline-block" } : { display: "none" }
              }
              className="createBtn"
              onClick={() => {
                clickCreate();
              }}
            >
              建立活動
              {/* <CircularIndeterminate
              style={!isLoading ? { display: "block" } : { display: "none" }}
            /> */}
            </Button>
            <Button
              disabled={!isLoading}
              style={
                isLoading
                  ? {
                      display: "inline-block",
                    }
                  : { display: "none" }
              }
            >
              <CircularIndeterminate
                style={isLoading ? { display: "block" } : { display: "none" }}
              />
            </Button>
          </ButtonField>
        </CreateDetailContainer>
      </Container>
    </MainContainer>
  );
}
const MainContainer = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)),
    url(${concertImg});
  background-size: cover;
  background-position: 50% 50%;
  padding: 50px 20px;
  position: relative;
`;
const MainContainerCanvas = styled.div``;
const Container = styled.div`
  text-align: left;
  max-width: 1024px;
  margin: 0 auto;
  height: 100%;
  border: 1px solid #979797;
  padding: 50px 20px;
`;
const ProcessIntroContainer = styled.div`
  width: 960px;
  height: 400px;
  margin: 0 auto;
`;
const ProcessIntro = styled.div``;
const CreateDetailTopBar = styled.div`
  width: 100%;
  height: 8px;
  background: #43e8d8;
`;
const CreateDetailContainer = styled.div`
  max-width: 888px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  color: black;
  background: white;
  /* padding: 20px; */
  padding-top: 0px;
  padding-bottom: 50px;
  @media (max-width: 768px) {
    width: 90%;
  }
`;
const CreateDetail = styled.div`
  display: flex;
  /* flex-direction: column; */
  line-height: 30px;
  margin: 0px 20px;
  padding: 20px;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const CreateDetailContent = styled.div``;
const CreateDetailImageContainer = styled.div`
  width: 50%;
  padding: 0 0 20px 10px;
  height: auto;
  @media (max-width: 768px) {
    height: 300px;
    margin-left: 0px;
    display: none;
  }
`;
const CreateDetailImage = styled.img`
  background: #979797;
  object-fit: cover;
  width: 100%;
  height: 100%;
  /* margin-left: 20px; */
  @media (max-width: 768px) {
    height: 300px;
    margin-left: 0px;
    display: none;
  }
`;
const Title = styled.div`
  font-size: 24px;
  margin: 20px 40px 0px 40px;
  padding: 10px 0;
  border-bottom: 1px solid #979797;
`;
const InputFieldDiv = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  position: relative;
  /* text-align: center; */
`;
const Inputfield = styled.input`
  border-bottom: 1px solid #979797;
  width: 220px;
  height: 40px;
  padding: 5px;
  @media (max-width: 768px) {
    width: 70%;
  }
  @media (max-width: 576px) {
    width: 220px;
  }
`;
const SelectType = styled.select`
  padding: 5px;
  width: 220px;
  @media (max-width: 768px) {
    width: 70%;
  }
  @media (max-width: 576px) {
    width: 220px;
  }
`;
const InputTextArea = styled.textarea`
  width: 220px;
  height: 80px;
  border: 1px solid #979797;
  padding: 5px;
  resize: none;
  line-height: 20px;
  @media (max-width: 768px) {
    width: 70%;
  }
  @media (max-width: 576px) {
    width: 220px;
  }
`;
const InputfieldImage = styled.input`
  width: 220px;
  @media (max-width: 768px) {
    width: 70%;
  }
  @media (max-width: 576px) {
    width: 220px;
  }
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
  width: 90px;
  display: inline-block;
  @media (max-width: 768px) {
    width: 90px;
  }
`;
const ButtonField = styled.div`
  text-align: center;
`;
const Button = styled.button`
  /* border: 1px solid #979797; */
  padding: 5px;
  border-radius: 4px;
  padding: 12px 40px;
  background: #43e8d8;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #4cffee;
    transform: translateY(-2px);
    box-shadow: 0 0 10px #43e8d8;
  }
`;
const RequireField = styled.span`
  color: red;
  display: inline-block;
  position: absolute;
  left: -10px;
`;
// const Warning = styled.div`
//   width: 120px;
//   font-size: 12px;
// `;
export default Create;
