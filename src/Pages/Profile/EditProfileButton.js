import "../../App.css";
import "./EditProfileButton.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData, updateUserData, uploadImage } from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch } from "react-redux";
import settingIcon from "../../images/gear.svg";

const StyledModal = Modal.styled`
width: 30rem;
height: 35rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;`;
let imgSource = "";

function EditProfileButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

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
    let updateToFirebase = await updateUserData(data, userDataRedux.uid);
    // setUserData(data);
    dispatch({ type: "UPDATE_USERDATA", data: data });

    setOpacity(0);
    setIsOpen(!isOpen);
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

  function toggleModal(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
  }
  function toggleCancel(e) {
    setOpacity(0);
    setIsOpen(!isOpen);

    //取消時把值設回Redux上的值
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
    <div>
      <EditBtn onClick={toggleModal}>編輯個人檔案</EditBtn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        // onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <Container>
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
            </InputFieldContainer>
            <InputFieldContainer style={{ alignItems: "normal" }}>
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
              <MultiSelect
                style={{ width: "100px" }}
                options={options}
                value={skill}
                onChange={setSkill}
                labelledBy="Select"
              />
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
            <BtnCancel onClick={toggleCancel}>取消</BtnCancel>
            <BtnConfirm onClick={editConfirm}>確認修改</BtnConfirm>
          </BtnField>
        </Container>
      </StyledModal>
    </div>
  );
}
const Container = styled.div`
  position: relative;
`;
const ProfileDetail = styled.div`
  text-align: left;
  width: 300px;
`;
const Label = styled.label`
  width: 80px;
`;
const InputFieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const InputFieldInput = styled.input`
  border: 1px solid #979797;
  height: 30px;
  width: calc(100% - 80px);
  padding: 5px;
`;
const IntroTextArea = styled.textarea`
  width: calc(100% - 80px);
  height: 110px;
  border: 1px solid #979797;
  padding: 5px;
  resize: none;
`;

const SelectType = styled.select`
  width: calc(100% - 80px);
`;

const BtnField = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-around;
  align-items: center;
  margin-top: 50px;
`;

const BtnCancel = styled.div`
  border: 1px solid #000;
  border-radius: 20px;
  width: 100px;
  padding: 5px;
  cursor: pointer;
`;
const BtnConfirm = styled.div`
  border: 1px solid none;
  border-radius: 20px;
  width: 100px;
  padding: 5px;
  background: #ff6600;
  align-items: center;

  cursor: pointer;
`;
const ProfileImage = styled.div`
  margin: 0 auto;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  border-radius: 50%;
  background-size: cover;

  background-position: 50% 50%;
`;
const ProfileImg = styled.img`
  object-fit: cover;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
`;
const ProfileImageContainer = styled.div`
  align-items: center;
  position: relative;
`;
const EditProfileImageField = styled.div``;
const EditImageIcon = styled.img`
  width: 25px;
  position: absolute;
  top: 0;
  right: 70px;
`;
const EditBtn = styled.button`
  border: 1px solid none;
  border-radius: 20px;
  background: #00ffff;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  height: 40px;
`;

export default EditProfileButton;
