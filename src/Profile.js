import "./App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import { getUserData } from "./utils/firebase";
import { updateUserData } from "./utils/firebase";
import { getUserHostActivities } from "./utils/firebase";
import { getUserJoinActivities } from "./utils/firebase";
import { getUserApplyActivities } from "./utils/firebase";
import { agreeJoinActivity } from "./utils/firebase";
import { kickActivity } from "./utils/firebase";
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
const ProfileContainer = styled.div`
  display: flex;
  width: 960px;
  justify-content: space-around;
  margin: 0 auto;
`;
const ProfileCol = styled.div`
  width: 360px;
`;
const ActivitiesCol = styled.div`
  display: flex;
  flex-direction: column;
`;
const MyHostTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
`;
const MyJoinTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
  text-align: left;
  margin: 0 auto;
  width: 100%;
`;
const MyHost = styled.div`
  display: flex;
`;
const MyJoin = styled.div`
  display: flex;
`;
function FancyModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  let userId = "vfjMHzp45ckI3o3kqDmO";
  let defaultPreferType = "";
  let skillFormat = [];
  let skillArray = [];

  const [skill, setSkill] = useState(skillFormat);

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
  ];

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    console.log(data);
    //處理skill格式 讓default值可顯示於select
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
      <button onClick={toggleModal}>編輯個人檔案</button>
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
            labelledBy="Select"
          />
        </InputFieldContainer>
        <button onClick={toggleModal}>取消</button>
        <button onClick={editConfirm}>確認修改</button>
      </StyledModal>
    </div>
  );
}

function EditActivitiesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

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
      <button onClick={toggleModal}>編輯活動</button>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <button onClick={toggleModal}>Close me</button>
      </StyledModal>
    </div>
  );
}

function EditActivitiesMemberButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  console.log(props.applicants);
  console.log(props.attendants);
  const [applicantsData, setApplicantsData] = useState([]);
  const [attendantsData, setAttendantsData] = useState([]);
  let applicantsArray = [];
  let attendantsArray = [];

  const getApplicantsDetail = async () => {
    props.applicants.forEach((applicant) => {
      const promise = getUserData(applicant).then((data) => {
        return data;
      });
      applicantsArray.push(promise);
    });
    const allApplicants = await Promise.all(applicantsArray);
    console.log(allApplicants);
    setApplicantsData(allApplicants);
  };
  const getAttendantsDetail = async () => {
    props.attendants.forEach((attendant) => {
      const promise = getUserData(attendant).then((data) => {
        return data;
      });
      attendantsArray.push(promise);
    });
    const allAttendants = await Promise.all(attendantsArray);
    console.log(allAttendants);
    setAttendantsData(allAttendants);
  };

  const handleAgree = (e) => {
    console.log(e.userId);
    agreeJoinActivity(props.activityId, e.userId);
  };
  const handleKick = (e) => {
    console.log(e.userId);
    kickActivity(props.activityId, e.userId);
  };

  useEffect(() => {
    console.log("><");
    getApplicantsDetail();
    getAttendantsDetail();
  }, []);

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

  if (!applicantsData || !attendantsData) {
    return "isLoading";
  }

  const renderApplicants = () => {
    if (applicantsData.length !== 0) {
      const applicantsHTML = applicantsData.map((item) => {
        return (
          <div>
            <div>{item.name}</div>
            <button
              onClick={() => {
                handleAgree(item);
              }}
            >
              同意
            </button>
          </div>
        );
      });
      return applicantsHTML;
    } else {
      return <div>沒有申請者</div>;
    }
  };

  const renderAttendants = () => {
    if (attendantsData.length !== 0) {
      const attendantsHTML = attendantsData.map((item) => {
        return (
          <div>
            <div>{item.name}</div>
            <button
              onClick={() => {
                handleKick(item);
              }}
            >
              踢
            </button>
          </div>
        );
      });
      return attendantsHTML;
    } else {
      return <div>尚未有出席者</div>;
    }
  };

  return (
    <div>
      <button onClick={toggleModal}>查看申請</button>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <div>{renderApplicants()}</div>
        <div>{renderAttendants()}</div>

        <button onClick={toggleModal}>Close me</button>
      </StyledModal>
    </div>
  );
}
function Profile() {
  let userId = "vfjMHzp45ckI3o3kqDmO";
  const [userData, setUserData] = useState();
  const [userActivities, setUserActivities] = useState();
  const [userJoinActivities, setUserJoinActivities] = useState([]);

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    console.log(data);
    setUserData(data);
  };

  const getUserActivitiesData = async () => {
    const data = await getUserHostActivities(userId);
    console.log(data);

    const attendActivities = await getUserJoinActivities(userId);
    console.log(attendActivities);
    const applyActivities = await getUserApplyActivities(userId);
    console.log(applyActivities);
    setUserJoinActivities((a) => [...a, ...attendActivities]);
    setUserJoinActivities((a) => [...a, ...applyActivities]);

    //打多次userData, 一次取得多個 applicants 的userData詳細資料，放進userActivities 裡面以便之後取用
    // const applicantsDetailArray = [];
    // data.forEach(async (item) => {
    //   console.log(item);
    //   console.log(item.applicants);
    //   item.applicants.forEach((data) => {
    //     const promise = getUserData(data).then((data) => {
    //       return data;
    //     });
    //     applicantsDetailArray.push(promise);
    //   });
    //   const allApplicants = await Promise.all(applicantsDetailArray);
    //   console.log(allApplicants);
    //   data.applicants = allApplicants;
    // });

    setUserActivities(data);
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
    getUserActivitiesData();
  }, []);

  if (!userData) {
    return "isLoading";
  }
  if (!userActivities || !userJoinActivities) {
    return "isLoading";
  }

  console.log(userJoinActivities);

  const activitiesHTML = userActivities.map((data) => {
    return (
      <div>
        <div>{data.title}</div>
        <div>{data.host}</div>
        <div>{data.id}</div>
        <div>
          <EditActivitiesButton />
          <EditActivitiesMemberButton
            applicants={data.applicants}
            attendants={data.attendants}
            activityId={data.id}
          />
        </div>
      </div>
    );
  });

  const joinActivitiesHTML = userJoinActivities.map((data) => {
    return (
      <div>
        <div>{data.title}</div>
        <div>{data.host}</div>
        <div>{data.id}</div>
        <div>
          <button>查看活動</button>
        </div>
      </div>
    );
  });

  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <div>
        <div>this is profile page</div>
        <ProfileContainer>
          <ActivitiesCol>
            <MyHostTitle>我的開團</MyHostTitle>
            <MyHost>{activitiesHTML}</MyHost>

            <MyJoinTitle>我的跟團</MyJoinTitle>
            <MyJoin>{joinActivitiesHTML}</MyJoin>
          </ActivitiesCol>

          <ProfileCol>
            {renderProfile()}
            <FancyModalButton />
          </ProfileCol>
        </ProfileContainer>
      </div>
    </ModalProvider>
  );
}

export default Profile;
