import "../../App.css";
import "./EditProfileButton.css";
import styled from "styled-components";
import React, { useEffect, useState, useCallback } from "react";
import { getUserData, updateUserData, uploadImage } from "../../utils/firebase";
import * as Warning from "./Validate";

import Modal from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch } from "react-redux";
import settingIcon from "../../images/gear.svg";
import xIcon from "../../images/x.svg";
import { SelectTypeBlackEditHTML } from "../../Components/SelectComponent";
import IsLoading from "../../Components/IsLoading";

const StyledMultiSelect = styled(MultiSelect)`
  border-bottom: 1px solid #979797;
  --rmsc-border: unset !important;
  --rmsc-bg: #121212;
  --rmsc-hover: #979797;
  --rmsc-selected: #43ede8a6;
  --rmsc-h: 40px !important;
  --rmsc-main: none;

  color: white;
  text-align: left;
  .dropdown-heading {
    cursor: pointer;
  }
`;
const StyledModal = Modal.styled`
width: 35rem;
height: 80%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #121212;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
overflow-y: scroll;
border-radius: 4px;
border-top: 6px solid #ff00ff;

`;
let imgSource = "";

function EditProfileButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const [validationResult, setValidationResult] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const userDataRedux = useSelector((state) => state.userData);
  const dispatch = useDispatch();

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
    { label: "電吉他", value: "電吉他" },
    { label: "貝斯", value: "貝斯" },
    { label: "鍵盤", value: "鍵盤" },
    { label: "爵士鼓", value: "爵士鼓" },
  ];

  const getUserProfileData = useCallback(() => {
    const gettingUserProfileData = async () => {
      const data = await getUserData(userDataRedux.uid);
      setUserData(data);
      setUserProfileImage(data.profileImage);
    };
    gettingUserProfileData();
  }, [userDataRedux.uid]);
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
  }, [getUserProfileData]);
  if (!userData) {
    return "isLoading";
  }

  async function editConfirm(e) {
    if (userProfileImageSource) {
      //有變更照片，儲存時顯示isLoading
      setLoadingStatus(true);
      imageUrl = await uploadImage(userProfileImageSource);

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

      setLoadingStatus(false);

      if (inputValidation()) {
        await updateUserData(data, userDataRedux.uid);
        dispatch({ type: "UPDATE_USERDATA", data: data });

        setOpacity(0);
        setIsOpen(!isOpen);
      }
    } else {
      imageUrl = userDataRedux.profileImage;

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

      if (inputValidation()) {
        await updateUserData(data, userDataRedux.uid);
        dispatch({ type: "UPDATE_USERDATA", data: data });

        setOpacity(0);
        setIsOpen(!isOpen);
      }
    }
  }

  function handleProfileChange(e, type) {
    setUserData({ ...userData, [type]: e });
  }
  function handlePreferTypeDefault() {
    defaultPreferType = userDataRedux.preferType;
  }
  function handleClickToUpload() {
    const uploadProfileImage = document.querySelector("#uploadProfileImage");
    uploadProfileImage.click();
  }
  function handleUploadImage(e) {
    imgSource = e.target.files[0];
    setUserProfileImage(URL.createObjectURL(imgSource));
    setUserProfileImageSource(imgSource);
  }

  function inputValidation() {
    let validRule =
      /^(http(s)??:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
    if (
      userData.name.length === 0 ||
      userData.name.length > 10 ||
      userData.intro.length > 250 ||
      skill.length === 0 ||
      (userData.youtubeUrl.search(validRule) === -1 && userData.youtubeUrl)
    ) {
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
    setUserProfileImageSource();
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
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <Container>
          <ContentTitle>個人檔案詳細資料</ContentTitle>
          <CloseIconContainer>
            <CloseIcon src={xIcon} onClick={toggleCancel} />
          </CloseIconContainer>
          <ContentContainer>
            <ProfileImageContainer>
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
                <Label htmlFor="name">名稱</Label>
                <InputFieldInput
                  id="name"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    handleProfileChange(e.target.value, "name");
                  }}
                  defaultValue={userDataRedux.name}
                />

                {Warning.warningProfileNameHTML(userData.name)}
              </InputFieldContainer>

              <InputFieldContainer>
                {handlePreferTypeDefault()}

                <Label htmlFor="preferType">偏好類型</Label>
                <SelectTypeBlackEditHTML
                  defaultValue={defaultPreferType}
                  handleProfileChange={handleProfileChange}
                />
              </InputFieldContainer>
              <InputFieldContainer>
                <Label htmlFor="skill">會的樂器</Label>
                <StyledMultiSelect
                  className="EditProfileMulti"
                  overrideStrings={override}
                  disableSearch={true}
                  style={{ width: "100px" }}
                  options={options}
                  value={skill}
                  onChange={setSkill}
                  labelledBy="Select"
                />
                {Warning.warningProfileSkillHTML(skill)}
              </InputFieldContainer>
              <InputFieldContainer style={{ alignItems: "unset" }}>
                <Label htmlFor="intro">自我介紹</Label>
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
                <Label htmlFor="youtubeSource">YouTube</Label>
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
                {Warning.warningYoutubeHTML(userData.youtubeUrl)}
              </InputFieldContainer>
            </ProfileDetail>
            <BtnField>
              <BtnConfirm onClick={editConfirm}>
                {loadingStatus ? (
                  <IsLoading loadingStyle={"buttonSmall"} size={30} />
                ) : (
                  "儲存"
                )}

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
`;
const ProfileDetail = styled.div`
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

const BtnField = styled.div`
  display: flex;
  width: 350px;
  justify-content: space-around;
  align-items: center;
  margin: 30px auto;
`;

const BtnConfirm = styled.div`
  border: 1px solid #43e8d8;
  border-radius: 8px;
  /* width: 100px; */
  /* padding: 12px 40px; */
  /* 按鈕內要放isloading */
  width: 120px;
  height: 44px;
  line-height: 44px;

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
  bottom: -40px;
  left: -24px;
  @media (max-width: 576px) {
  }
`;

const ProfileImg = styled.img`
  object-fit: cover;
  width: 200px;
  height: 200px;
  border-radius: 50%;
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
