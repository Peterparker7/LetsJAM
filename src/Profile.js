import "./App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData } from "./utils/firebase";
import { updateUserData } from "./utils/firebase";
import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";

const StyledModal = Modal.styled`
width: 20rem;
height: 20rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;`;

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

const InputFieldContainer = styled.div`
  display: flex;
`;

const InputFieldDiv = styled.div``;
const InputFieldInput = styled.input`
  border: 1px solid #979797;
`;
function FancyModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  let userId = "vfjMHzp45ckI3o3kqDmO";
  let defaultPreferType = "";
  let skillFormat = [];

  const [skill, setSkill] = useState(skillFormat);

  let skillArray = [];
  skill.forEach((data) => {
    skillArray.push(data.value);
  });

  const [userData, setUserData] = useState();

  //   userData.skill = skillArray;

  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
    { label: "Mango 🥭", value: "mango" },
  ];

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    console.log(data);
    data.skill.forEach((data) => {
      let skill = {
        label: data,
        value: data,
      };
      skillFormat.push(skill);
    });
    console.log(skillFormat);

    setUserData(data);
  };

  useEffect(() => {
    console.log("><");
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
    };
    console.log(data);
    console.log(userData.name);
    updateUserData(data, userId);
    setOpacity(0);
    setIsOpen(!isOpen);
  }

  function handleProfileChange(e, type) {
    if (type === "name") {
      userData.name = e;
    }
    if (type === "intro") {
      userData.intro = e;
    }
    if (type === "preferType") {
      userData.preferType = e;
    }
  }
  function handlePreferTypeDefault() {
    console.log(userData.preferType);
    if (userData.preferType === "流行") {
      defaultPreferType = "流行";
    }
    if (userData.preferType === "嘻哈") {
      defaultPreferType = "嘻哈";
    }
    if (userData.preferType === "古典") {
      defaultPreferType = "古典";
    }
  }

  function toggleModal(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
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
      <button onClick={toggleModal}>Open modal</button>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <InputFieldContainer>
          <label for="name">名稱</label>
          <InputFieldInput
            id="name"
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={(e) => {
              //   console.log(e.currentTarget.textContent);
              console.log(e.target.value);
              handleProfileChange(e.target.value, "name");
            }}
            defaultValue={userData.name}
          />

          {/* </div> */}
        </InputFieldContainer>
        <InputFieldContainer>
          <label for="intro">自我介紹</label>
          <InputFieldInput
            id="intro"
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={(e) => {
              console.log(e.target.value);
              handleProfileChange(e.target.value, "intro");
            }}
            defaultValue={userData.intro}
          />
        </InputFieldContainer>
        <InputFieldContainer>
          {handlePreferTypeDefault()}

          <label for="preferType">偏好曲風</label>
          <select
            defaultValue={defaultPreferType}
            onChange={(e) => {
              handleProfileChange(e.target.value, "preferType");
            }}
          >
            <option>流行</option>
            <option>嘻哈</option>
            <option>古典</option>
          </select>
        </InputFieldContainer>
        <InputFieldContainer>
          <label for="skill">會的樂器</label>
          <MultiSelect
            options={options}
            value={skill}
            onChange={setSkill}
            // onChange={(e) => {
            //   console.log(e);
            //   setRequirement();
            //   //   handleProfileChange(e, "skill");
            // }}
            labelledBy="Select"
          />
        </InputFieldContainer>
        <button onClick={toggleModal}>取消</button>
        <button onClick={editConfirm}>確認修改</button>
      </StyledModal>
    </div>
  );
}

function Profile() {
  let userId = "vfjMHzp45ckI3o3kqDmO";
  const [userData, setUserData] = useState();

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    console.log(data);
    setUserData(data);
  };
  const renderProfile = () => {
    console.log(userData);
    return (
      <div>
        <div>{userData.profileImage}</div>
        <div>{userData.name}</div>
        <div>{userData.intro}</div>
        <div>{userData.email}</div>
        <div>{userData.preferType}</div>
        <div>{userData.skill}</div>
        <div>{userData.favSinger}</div>
      </div>
    );
  };

  const handleEditProfile = () => {};

  useEffect(() => {
    console.log("><");
    getUserProfileData();
  }, []);

  if (!userData) {
    return "isLoading";
  }

  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <div>
        <div>this is profile page</div>
        {renderProfile()}
        <FancyModalButton />
      </div>
    </ModalProvider>
  );
}

export default Profile;
