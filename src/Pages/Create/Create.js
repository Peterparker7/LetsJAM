import "../../normalize.css";
import "./Create.css";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import MultiSelect from "react-multi-select-component";
import { uploadImage } from "../../utils/firebase";

import concertImg from "../../images/concert1.jpg";
import cloudUpload from "../../images/cloud-upload.svg";
import { useSelector } from "react-redux";

import * as Warning from "./Warning";
import Place from "./Place";
import IsLoading from "../../Components/IsLoading";

import CircularIndeterminate from "./CircularProgress";
import { SelectTypeWhiteHTML } from "../../Components/SelectComponent";
import {
  MaterialUIPickersTime,
  MaterialUIPickersDate,
} from "../../Components/DateTimePicker";
import Tooltip from "@material-ui/core/Tooltip";
import arrowLeft from "../../images/arrow-left-short.svg";

const db = firebase.firestore();

const StyledMultiSelect = styled(MultiSelect)`
  border-bottom: 1px solid #979797;
  --rmsc-border: unset !important;
  --rmsc-bg: #f8f8ff;
  --rmsc-selected: #43ede8a6;
  --rmsc-main: none;
  --rmsc-h: 38px !important;

  --rmsc-p: 5px;
  transition: 0.3s;
  .dropdown-heading {
  }
  .dropdown-content {
  }
  .item-renderer {
    padding: 5px 5px;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
let currentNumber = 1;

function Create(props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("流行");
  const [limit, setLimit] = useState(0);
  const [imgUrl, setimgUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/personalproject-33263.appspot.com/o/travis-yewell-F-B7kWlkxDQ-unsplash.jpg?alt=media&token=f3254958-e279-4e31-8175-faea930a1532"
  );
  const [level, setLevel] = useState("");
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
  const [placeStatus, setPlaceStatus] = useState(true);

  const [requirement, setRequirement] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();

  let youtubeUrl = "";
  let imgSource = "";
  let imageUrl = "";

  const userDataRedux = useSelector((state) => state.userData);

  const host = userDataRedux.uid;

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

  let sat = addDays(nowDate, 6 - nowDate.getDay())
    .toISOString()
    .substr(0, 10);

  useEffect(() => {
    setDate(sat);
    setTime("16:00");
    currentNumber = 1;
  }, [sat]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (props.userUid === "") {
    return <IsLoading loadingStyle={"normal"} size={40} />;
  } else if (!props.userUid) {
    history.push("/");
    return "redirection";
  }

  const clickUpload = () => {
    let uploadFile = document.querySelector("#uploadFile");
    uploadFile.click();
  };

  const createFormCheck = () => {
    let nowDate = Date.now();
    let a = time.split(":");
    let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
    let deviation = 8 * 60 * 60000;
    console.log(nowDate);
    console.log(Date.parse(date) + milliseconds - deviation);
    console.log(titleStatus);
    console.log(dateStatus);
    console.log(timeStatus);
    console.log(requirementStatus);
    console.log(placeStatus);
    console.log(levelStatus);
    console.log(imgUrl);
    console.log(checked);

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
      // setImageStatus(false);
    }

    if (
      !title ||
      title.length > 10 ||
      !titleStatus ||
      !dateStatus ||
      !timeStatus ||
      !typeStatus ||
      requirement.length === 0 ||
      !limitStatus ||
      !levelStatus ||
      !place ||
      !placeStatus ||
      place.length > 30 ||
      !imgUrl
    ) {
      console.log("Validation fail");
      return false;
    } else {
      return true;
    }
  };

  const clickCreate = async () => {
    console.log(currentNumber);

    let newTimestamp = new Date(`${date}T${time}`);
    let timestamp = new Date(`${date}T${time}`);

    // imageUrl = await uploadImage(imgSource);

    const activityData = db.collection("activityData").doc();

    if (createFormCheck()) {
      if (checked) {
        setLimit(0);
        currentNumber = 0;
      } else {
        setLimit(currentNumber);
      }
      let newData = {
        id: activityData.id,
        title: title,
        type: type,
        limit: currentNumber,
        // limit: limit,
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
      await activityData.set(newData);
      history.push("/");
      // window.location.replace("./");
      currentNumber = 1;
    }
  };

  let override = {
    allItemsAreSelected: "所有樂器",
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
    { label: "電吉他", value: "電吉他" },
    { label: "貝斯", value: "貝斯" },
    { label: "鍵盤", value: "鍵盤" },
    { label: "爵士鼓", value: "爵士鼓" },
  ];

  let requirementArray = [];
  requirement.forEach((data) => {
    requirementArray.push(data.value);
  });

  if (!userDataRedux) {
    return "isloading";
  }

  function handleChange(e, changeType) {
    let nowDate = Date.now();
    let deviation = 8 * 60 * 60000;

    if (changeType === "title") {
      setTitle(e.target.value);
      setTitleStatus(true);
    }
    if (changeType === "date") {
      setDate(e);
      console.log(e);
      setDateStatus(true);
      if (nowDate >= Date.parse(e) + 16 * 60 * 60000) {
        setDateStatus(false);
      }
    }
    if (changeType === "time") {
      let a = e.split(":");
      let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
      console.log("kkk");
      setTime(e);
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
      // setLimit(e.target.value);
      setLimitStatus(true);
      currentNumber = e.target.value;
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
            defaultValue={currentNumber}
            // defaultValue={limit}
            min="1"
            max="20"
            onChange={(e) => {
              handleChange(e, "limit");
            }}
          />
        </div>
      );
    }
  };

  async function handleUploadImage(e) {
    // setIsLoading(true);
    if (e.target.value) {
      setIsLoading(true);

      console.log(e.target.value);
      console.log("handleUploadImage");
      imgSource = e.target.files[0];
      console.log(imgSource);
      // console.log(imgSource);
      imageUrl = await uploadImage(imgSource);

      setimgUrl(imageUrl);
      console.log(imageUrl);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }

  return (
    <MainContainer>
      <Container>
        <CreateDetailContainer>
          <CreateDetailTopBar></CreateDetailTopBar>
          <Tooltip title="回上頁" interactive>
            <BackArrowContainer>
              <Link to={"/"}>
                <BackArrow src={arrowLeft} />
              </Link>
            </BackArrowContainer>
          </Tooltip>

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
                    if (e.target.value) {
                      handleChange(e, "title");
                    } else {
                      setTitleStatus(false);
                    }
                  }}
                ></Inputfield>
                {Warning.warningTitleHTML(title, titleStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>日期</Label>

                <MaterialUIPickersDate
                  handleChange={handleChange}
                  // time={time}
                  // datesat={date}
                />
                {Warning.warningDateHTML(date, dateStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>時間</Label>

                <MaterialUIPickersTime
                  handleChange={handleChange}
                  // time={time}
                  // datesat={date}
                />
                {Warning.warningTimeHTML(date, time, timeStatus)}
              </InputFieldDiv>
              <InputFieldDiv>
                <Label>音樂類型</Label>
                <SelectTypeWhiteHTML setType={setType} />

                {/* <SelectType
                  onChange={(e) => {
                    handleChange(e, "type");
                  }}
                >
                  <option>流行</option>
                  <option>嘻哈</option>
                  <option>古典</option>
                </SelectType> */}
                {Warning.warningTypeHTML(type, typeStatus)}
              </InputFieldDiv>
              {/* <SelectRequireWhiteHTML setRequirement={setRequirement} /> */}
              <InputFieldDiv>
                <RequireField>*</RequireField>
                <Label>樂器需求</Label>
                <StyledMultiSelect
                  className="createPageMultiSelect"
                  options={options}
                  value={requirement}
                  disableSearch={true}
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
                  <LimitInputContainer>
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
                        //取消checkbox時要把limit設1,
                        else if (checked) {
                          setLimit(1);
                        }
                      }}
                    />

                    <label htmlFor="noLimit">無</label>
                  </LimitInputContainer>
                </LimitDiv>
                {Warning.warningLimitHTML(limit, limitStatus)}
              </InputFieldDiv>

              <InputFieldDiv>
                <Label>建議程度</Label>
                <Inputfield
                  placeholder="請描述 如：初階/進階"
                  onChange={(e) => {
                    handleChange(e, "level");
                    if (e.target.value.length > 20) {
                      console.log("too many");
                      setLevelStatus(false);
                    } else {
                      setLevelStatus(true);
                    }
                  }}
                ></Inputfield>
                {Warning.warningLevelHTML(level, levelStatus)}
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
                {Warning.warningLocationHTML(
                  place,
                  placeStatus,
                  setPlaceStatus
                )}
              </InputFieldDiv>
              <InputFieldDiv style={{ alignItems: "unset" }}>
                <Label>活動說明</Label>
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
                  style={{ display: "none" }}
                  id="uploadFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleUploadImage(e);
                    if (e.target.value) {
                      // setImageStatus(true);
                    } else {
                      // setImageStatus(false);
                      // console.log("no input");
                    }
                  }}
                ></InputfieldImage>
                <UploadImageContainer
                  onClick={() => {
                    clickUpload();
                  }}
                >
                  <UploadImageIcon src={cloudUpload} />
                  <UploadImageText>上傳</UploadImageText>
                </UploadImageContainer>
                {/* {Warning.warningImageHTML(imageUrl, imageStatus)} */}
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
  min-height: calc(100vh-180px);
`;

const Container = styled.div`
  text-align: left;
  max-width: 1024px;
  margin: 0 auto;
  height: 100%;
  position: relative;
  /* border: 1px solid #979797; */
  /* padding: 50px 20px; */
`;
const CreateDetailTopBar = styled.div`
  width: 100%;
  height: 8px;
  background: #43e8d8;
`;
const BackArrowContainer = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: -39px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: translateY(-3px);
  }
`;
const BackArrow = styled.img`
  width: 100%;
`;
const CreateDetailContainer = styled.div`
  max-width: 888px;
  margin: 0 auto;
  /* margin-top: 20px; */
  margin-bottom: 20px;
  color: black;
  background: #f8f8ff;
  /* padding: 20px; */
  padding-top: 0px;
  padding-bottom: 50px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 100%;
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
  @media (max-width: 414px) {
    margin: 0;
  }
`;
const CreateDetailContent = styled.div`
  margin-left: 10px;
`;
const CreateDetailImageContainer = styled.div`
  width: 55%;
  padding: 0 0 20px 10px;
  height: 585.98px;
  @media (max-width: 768px) {
    height: 300px;
    margin-left: 0px;
    width: 100%;
    padding-left: 0px;
    /* display: none; */
  }
  @media (max-width: 576px) {
    /* max-height: 300px; */
  }
`;
const CreateDetailImage = styled.img`
  background: #979797;
  object-fit: cover;
  width: 100%;
  height: 100%;
  /* margin-left: 20px; */
  @media (max-width: 768px) {
    max-height: 300px;
    margin-left: 0px;
    /* display: none; */
  }
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin: 20px 40px 10px 40px;
  padding: 10px 0;
  border-bottom: 1px solid #979797;
  @media (max-width: 414px) {
    margin: 20px 20px 10px 20px;
  }
`;
const InputFieldDiv = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  /* height: 40px; */
  /* text-align: center; */
`;
const Inputfield = styled.input`
  border-bottom: 1px solid #979797;
  width: 220px;
  height: auto;
  padding: 5px;
  ::placeholder {
    color: #aaa;
  }
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
// const SelectType = styled.select`
//   padding: 5px;
//   width: 220px;
//   border-bottom: 1px solid #979797;

//   @media (max-width: 768px) {
//     width: 90%;
//   }
//   @media (max-width: 576px) {
//     width: 90%;
//   }
// `;
const InputTextArea = styled.textarea`
  width: 220px;
  height: 80px;
  border: 1px solid #979797;
  padding: 5px;
  resize: none;
  line-height: 20px;
  white-space: pre-line;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
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
const UploadImageContainer = styled.button`
  display: flex;
  width: 220px;
  height: 40px;
  /* border: 1px solid #979797; */
  border-radius: 8px;
  background: #dedede;

  padding: 12px auto;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
    /* border: 1px solid #979797; */
    background: #bdbdbd;
  }
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
const UploadImageText = styled.div``;
const UploadImageIcon = styled.img`
  width: 28px;
`;
const LimitInputField = styled.input`
  width: 50px;
  height: 30px;
  padding: 5px;
  border: 1px solid #979797;
  @media (max-width: 768px) {
  }
  @media (max-width: 576px) {
  }
`;
const LimitCheckBoxField = styled.input`
  width: 30px;
`;
const LimitInputContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    padding-left: 15px;
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
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
  border-radius: 8px;
  padding: 12px 40px;
  /*按鈕大一點才可包住spinner */
  width: 200px;
  height: 50px;
  font-size: 20px;
  font-weight: 600;
  background: #43e8d8;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #4cffee;
    transform: translateY(-2px);
    box-shadow: 0 0 20px #43e8d8;
  }
  @media (max-width: 768px) {
    margin: 10px auto;
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
