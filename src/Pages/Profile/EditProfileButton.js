import "../../App.css";
import "./EditProfileButton.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData, updateUserData, uploadImage } from "../../utils/firebase";
import * as Warning from "./Validate";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch } from "react-redux";
import settingIcon from "../../images/gear.svg";
import xIcon from "../../images/x.svg";

const StyledMultiSelect = styled(MultiSelect)`
  /* border-bottom: 1px solid #979797; */
  --rmsc-border: unset !important;
  --rmsc-bg: #121212;
  --rmsc-hover: #ff00ff96;
  --rmsc-selected: #43ede8a6;
  --rmsc-h: 40px !important;
  color: white;
  text-align: left;
`;
const StyledModal = Modal.styled`
width: 35rem;
height: 80%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
overflow-y: scroll;
border-radius: 4px;
`;
let imgSource = "";

function EditProfileButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const [validationResult, setValidationResult] = useState(true);

  const userDataRedux = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // let userId = "vfjMHzp45ckI3o3kqDmO";
  //   let userId = "SM7VM6CFOJOZwIDA6fjB";
  let defaultPreferType = "";
  let skillFormat = [];
  let skillArray = [];
  let imageUrl = "";

  const [skill, setSkill] = useState(skillFormat);

  skill.forEach((data) => {
    skillArray.push(data.value);
  });

  const [userData, setUserData] = useState();
  const [userProfileImage, setUserProfileImage] = useState();
  const [userProfileImageSource, setUserProfileImageSource] = useState();
  const [imgCover, setImgCover] = useState(true);

  let override = {
    allItemsAreSelected: "我全都會",
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

  const getUserProfileData = async () => {
    const data = await getUserData(userDataRedux.uid);
    setUserData(data);
    setUserProfileImage(data.profileImage);
  };
  //處理skill格式 讓default值可顯示於select
  userDataRedux.skill.forEach((data) => {
    let skill = {
      label: data,
      value: data,
    };
    skillFormat.push(skill);
  });

  useEffect(() => {
    getUserProfileData();
  }, []);
  if (!userData) {
    return "isLoading";
  }

  async function editConfirm(e) {
    if (userProfileImageSource) {
      console.log("1");
      console.log(userProfileImageSource);
      imageUrl = await uploadImage(userProfileImageSource);
      console.log(imageUrl);
    } else {
      console.log("2");

      imageUrl = userDataRedux.profileImage;
    }

    let data = {
      uid: userData.uid,
      name: userData.name,
      intro: userData.intro,
      preferType: userData.preferType,
      skill: skillArray,
      favSinger: userData.favSinger,
      profileImage: imageUrl,
      youtubeUrl: userData.youtubeUrl,
    };
    console.log(data);

    if (inputValidation()) {
      let updateToFirebase = await updateUserData(data, userDataRedux.uid);
      // setUserData(data);
      dispatch({ type: "UPDATE_USERDATA", data: data });

      setOpacity(0);
      setIsOpen(!isOpen);
    }
  }
  //
  function handleProfileChange(e, type) {
    setUserData({ ...userData, [type]: e });
  }
  function handlePreferTypeDefault() {
    defaultPreferType = userDataRedux.preferType;
    // if (userDataRedux.preferType === "流行") {
    //   defaultPreferType = "流行";
    // }
  }
  function handleClickToUpload() {
    const uploadProfileImage = document.querySelector("#uploadProfileImage");
    uploadProfileImage.click();
  }
  function handleUploadImage(e) {
    imgSource = e.target.files[0];
    setUserProfileImage(URL.createObjectURL(imgSource));
    setUserProfileImageSource(imgSource);
    console.log(imgSource);
    console.log(userProfileImage);
    setImgCover("cover");
  }
  function inputValidation() {
    if (
      userData.name.length === 0 ||
      userData.name.length > 10 ||
      userData.intro.length > 250 ||
      skill.length === 0
    ) {
      console.log("valid fail");
      setValidationResult(false);
      return false;
    } else {
      setValidationResult(true);
      return true;
    }
  }

  function toggleModal(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
  }
  function toggleCancel(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
    //取消時把值設回Redux上的值
    setValidationResult(true);

    setUserData(userDataRedux);
    setUserProfileImage(userDataRedux.profileImage);
    setSkill(skillFormat);
  }

  function afterOpen() {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }

  function beforeClose() {
    return new Promise((resolve) => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });
  }

  return (
    <ModalDiv>
      <EditBtn onClick={toggleModal}>編輯個人檔案</EditBtn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <Container>
          <TopBar></TopBar>
          <ContentTitle>個人檔案詳細資料</ContentTitle>
          <CloseIconContainer>
            <CloseIcon src={xIcon} onClick={toggleCancel} />
          </CloseIconContainer>
          <ContentContainer>
            <ProfileImageContainer>
              {/* <label for="name">大頭照</label> */}
              {/* <ProfileImage
              // src={`${userProfileImage}`}
              // src={`${userData.profileImage}`}
              // alt=""
              // style={{
              //   background: `url(${userProfileImage})`,
              //   backgroundSize: `${imgCover}`,
              //   // backgroundPosition: "",
              //   // backgroundPosition: "50% 50%",

              // }}
              style={
                imgCover
                  ? {
                      background: `url(${userProfileImage})`,
                      backgroundSize: "cover",
                    }
                  : {
                      background: `url(${userProfileImage})`,
                      backgroundSize: "cover",
                    }
              }
            ></ProfileImage> */}
              <ProfileImg src={userProfileImage}></ProfileImg>
              <EditProfileImageField>
                <input
                  id="uploadProfileImage"
                  type="file"
                  accept="image/*"
                  hidden={true}
                  onChange={(e) => {
                    handleUploadImage(e);
                  }}
                ></input>
                <EditImageIcon
                  src={settingIcon}
                  alt=""
                  onClick={() => {
                    handleClickToUpload();
                  }}
                />
              </EditProfileImageField>
            </ProfileImageContainer>
            <ProfileDetail>
              <InputFieldContainer>
                <Label for="name">名稱</Label>
                <InputFieldInput
                  id="name"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    handleProfileChange(e.target.value, "name");
                  }}
                  defaultValue={userDataRedux.name}
                />

                {/* </div> */}
                {Warning.warningProfileNameHTML(userData.name)}
              </InputFieldContainer>

              <InputFieldContainer>
                {handlePreferTypeDefault()}

                <Label for="preferType">偏好類型</Label>
                <SelectType
                  defaultValue={defaultPreferType}
                  onChange={(e) => {
                    handleProfileChange(e.target.value, "preferType");
                  }}
                >
                  <option>流行</option>
                  <option>嘻哈</option>
                  <option>古典</option>
                </SelectType>
              </InputFieldContainer>
              <InputFieldContainer>
                <Label for="skill">會的樂器</Label>
                <StyledMultiSelect
                  className="EditProfileMulti"
                  overrideStrings={override}
                  style={{ width: "100px" }}
                  options={options}
                  value={skill}
                  onChange={setSkill}
                  labelledBy="Select"
                />
                {Warning.warningProfileSkillHTML(skill)}
              </InputFieldContainer>
              <InputFieldContainer style={{ alignItems: "unset" }}>
                <Label for="intro">自我介紹</Label>
                {/* <InputFieldInput
                id="intro"
                contentEditable="true"
                placeholder="寫點描述"
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  handleProfileChange(e.target.value, "intro");
                }}
                defaultValue={userDataRedux.intro}
              /> */}
                <IntroTextArea
                  id="intro"
                  contentEditable="true"
                  placeholder="寫點描述"
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    handleProfileChange(e.target.value, "intro");
                  }}
                  defaultValue={userDataRedux.intro}
                ></IntroTextArea>
                {Warning.warningProfileIntroHTML(userData.intro)}
              </InputFieldContainer>
              <InputFieldContainer>
                <Label for="youtubeSource">YouTube</Label>
                <InputFieldInput
                  id="youtubeSource"
                  placeholder="可放練習影片youtube連結"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    handleProfileChange(e.target.value, "youtubeUrl");
                  }}
                  defaultValue={userDataRedux.youtubeUrl}
                />

                {/* </div> */}
              </InputFieldContainer>
            </ProfileDetail>
            <BtnField>
              {/* <BtnCancel onClick={toggleCancel}>取消</BtnCancel> */}
              <BtnConfirm onClick={editConfirm}>
                儲存
                <ValidationResult
                  style={
                    !validationResult
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  請檢查所有欄位是否正確
                </ValidationResult>
              </BtnConfirm>
            </BtnField>
          </ContentContainer>
        </Container>
      </StyledModal>
    </ModalDiv>
  );
}
const ModalDiv = styled.div`
  position: relative;
`;
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #121212;
  color: white;
`;
const TopBar = styled.div`
  height: 6px;
  width: 100%;
  background: #ff0099;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 26px;
  right: 20px;
  z-index: 5;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    background: #2d2d2d;
  }
`;
const CloseIcon = styled.img`
  width: 100%;
`;
const ContentTitle = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  margin: 20px;
`;
const ContentContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  background: #121212;
  padding-bottom: 40px;

  /* text-align: center; */
`;
const ProfileDetail = styled.div`
  /* text-align: center; */
  /* text-align: left; */
  max-width: 400px;
  margin: 20px auto;
  @media (max-width: 576px) {
    margin: 20px auto;

    width: 90%;
  }
`;
const Label = styled.label`
  width: 80px;
`;
const InputFieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
`;

const InputFieldInput = styled.input`
  border-bottom: 1px solid #979797;
  height: 40px;
  width: calc(100% - 80px);
  padding: 10px;
  color: white;
`;
const IntroTextArea = styled.textarea`
  width: calc(100% - 80px);
  height: 110px;
  border: 1px solid #979797;
  padding: 5px;
  resize: none;
  line-height: 22px;
  letter-spacing: 1px;
  color: white;
`;

const SelectType = styled.select`
  width: calc(100% - 80px);
  color: white;
  padding: 5px;
`;

const BtnField = styled.div`
  display: flex;
  width: 350px;
  justify-content: space-around;
  align-items: center;
  margin: 30px auto;
`;

const BtnCancel = styled.div`
  border: 1px solid #000;
  border-radius: 20px;
  width: 100px;
  padding: 5px;
  cursor: pointer;
`;
const BtnConfirm = styled.div`
  border: 1px solid #43e8d8;
  border-radius: 8px;
  /* width: 100px; */
  padding: 12px 40px;
  align-items: center;
  position: relative;
  cursor: pointer;
  color: #000;
  background: #43e8d8;
  transition: 0.2s;

  box-shadow: 0 0 10px #43e8d8;
  &:hover {
    background: #4cffee;
    transform: translateY(-2px);
    box-shadow: 0 0 20px #43e8d8;
  }
`;
const ValidationResult = styled.div`
  position: absolute;
  color: white;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
  width: auto;
  font-size: 14px;
  width: 160px;
  bottom: -30px;
  left: -24px;
  @media (max-width: 576px) {
  }
`;

const ProfileImage = styled.div`
  margin: 0 auto;
  width: 180px;
  height: 180px;
  margin-bottom: 20px;
  border-radius: 50%;
  background-size: cover;

  background-position: 50% 50%;
`;
const ProfileImg = styled.img`
  object-fit: cover;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  /* margin-bottom: 20px; */
`;
const ProfileImageContainer = styled.div`
  align-items: center;
  position: relative;
  width: 200px;
  margin: 0 auto;
`;
const EditProfileImageField = styled.div``;
const EditImageIcon = styled.img`
  width: 25px;
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: translateY(-3px);
  }
`;
const EditBtn = styled.button`
  border: 1px solid none;
  border-radius: 8px;
  /* background: #00ffff; */
  background: #43e8d8;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 20px;
  height: 40px;
  transition: 0.2s;
  box-shadow: 0 0 10px #43e8d8;
  &:hover {
    background: #4cffee;
    transform: translateY(-2px);
    box-shadow: 0 0 20px #43e8d8;
  }
`;

export default EditProfileButton;
