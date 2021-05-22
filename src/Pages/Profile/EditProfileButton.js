import "../../App.css";
import "./EditProfileButton.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData, updateUserData } from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch } from "react-redux";

const StyledModal = Modal.styled`
width: 30rem;
height: 30rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;`;

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

  const [skill, setSkill] = useState(skillFormat);

  skill.forEach((data) => {
    skillArray.push(data.value);
  });

  const [userData, setUserData] = useState();

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

  function editConfirm(e) {
    let data = {
      name: userData.name,
      intro: userData.intro,
      preferType: userData.preferType,
      skill: skillArray,
      favSinger: userData.favSinger,
      profileImage: userData.profileImage,
    };
    updateUserData(data, userDataRedux.uid);
    // setUserData(data);
    dispatch({ type: "UPDATE_USERDATA", data: data });

    setOpacity(0);
    setIsOpen(!isOpen);
  }
  //
  function handleProfileChange(e, type) {
    setUserData({ ...userData, [type]: e });

    // if (type === "name") {
    //   setUserData({ ...userData, name: e });
    // }
    // if (type === "intro") {
    //   setUserData({ ...userData, intro: e });
    // }
    // if (type === "preferType") {
    //   setUserData({ ...userData, preferType: e });
    // }
  }
  function handlePreferTypeDefault() {
    defaultPreferType = userDataRedux.preferType;
    // if (userDataRedux.preferType === "流行") {
    //   defaultPreferType = "流行";
    // }
    // if (userDataRedux.preferType === "嘻哈") {
    //   defaultPreferType = "嘻哈";
    // }
    // if (userDataRedux.preferType === "古典") {
    //   defaultPreferType = "古典";
    // }
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
        <InputFieldContainer>
          {/* <label for="name">大頭照</label> */}
          <ProfileImage src={`${userData.profileImage}`} alt=""></ProfileImage>
        </InputFieldContainer>
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
          <InputFieldContainer>
            <Label for="intro">自我介紹</Label>
            <InputFieldInput
              id="intro"
              contentEditable="true"
              suppressContentEditableWarning={true}
              onInput={(e) => {
                handleProfileChange(e.target.value, "intro");
              }}
              defaultValue={userDataRedux.intro}
            />
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
        </ProfileDetail>
        <BtnField>
          <BtnCancel onClick={toggleCancel}>取消</BtnCancel>
          <BtnConfirm onClick={editConfirm}>確認修改</BtnConfirm>
        </BtnField>
      </StyledModal>
    </div>
  );
}

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
const ProfileImage = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const EditBtn = styled.button`
  border: 1px solid none;
  border-radius: 20px;
  background: #00ffff;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 50px;
`;

export default EditProfileButton;
