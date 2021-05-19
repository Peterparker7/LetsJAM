import "./App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getSpecificData,
  getUserData,
  updateUserData,
  getUserHostActivities,
  getUserJoinActivities,
  getUserApplyActivities,
  agreeJoinActivity,
  kickActivity,
  deleteActivityData,
  updateActivitiesData,
} from "./utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

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

const InputFieldDiv = styled.div`
  text-align: left;
`;
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
  width: 600px;
`;
const EditActivityCol = styled.div`
  margin: 0 auto;
`;
const Label = styled.label`
  margin-right: 10px;
`;
const ProfileImage = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;
const Btn = styled.button`
  border: 1px solid #979797;
  padding: 5px;
  cursor: pointer;
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
  flex-wrap: wrap;
`;
const MyJoin = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
function FancyModalButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const userDataRedux = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  let userId = "vfjMHzp45ckI3o3kqDmO";
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
    const data = await getUserData(userId);
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
    updateUserData(data, userId);
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
      <Btn onClick={toggleModal}>編輯個人檔案</Btn>
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
        <InputFieldContainer>
          <label for="name">名稱</label>
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
          <label for="intro">自我介紹</label>
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

          <label for="preferType">偏好類型</label>
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
        <button onClick={toggleCancel}>取消</button>
        <button onClick={editConfirm}>確認修改</button>
      </StyledModal>
    </div>
  );
}

function EditActivitiesButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const [oneactivityData, setActivityData] = useState();
  let limitInitial = 1;
  const [checked, setChecked] = useState();

  const getActivity = async () => {
    const data = await getSpecificData(props.data.id);
    setActivityData(data);
  };

  //   const userHostActivityDataRedux = useSelector(
  //     (state) => state.userHostActivityData
  //   );
  const userHostActivityDataRedux = useSelector(
    (state) =>
      state.userHostActivityData.find((m) => {
        return m.id === props.activityId;
      }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    getActivity();
    if (userHostActivityDataRedux.limit === 0) {
      setChecked(true);
    } else if (userHostActivityDataRedux.limit !== 0) {
      setChecked(false);
    }
  }, []);

  let activityData = props.data;

  function toggleModal(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
  }

  function toggleCancel(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
    setRequirement(requirementFormat);
    if (userHostActivityDataRedux.limit === 0) {
      setChecked(true);
    } else if (userHostActivityDataRedux.limit !== 0) {
      props.data.limit = userHostActivityDataRedux.limit;
      setChecked(false);
    }
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

  const editConfirm = () => {
    if (checked) {
      oneactivityData.limit = 0;
    }
    let data = {
      id: props.data.id,
      title: oneactivityData.title,
      limit: parseInt(oneactivityData.limit),
      date: oneactivityData.date,
      time: oneactivityData.time,
      //   timestamp: oneactivityData.timestamp,
      type: oneactivityData.type,
      level: oneactivityData.level,
      location: oneactivityData.location,
      comment: oneactivityData.comment,
      requirement: requirementArray,
    };
    console.log(data);
    updateActivitiesData(data, props.data.id);
    // props.setUserActivities({ ...data, title: data.title });
    // props.setUserActivities((prevState) => [...prevState, data.title]);

    // props.confirmArray.push(data);

    // const dataArr = [];
    // dataArr.push(data);
    // props.onEdit(dataArr);
    dispatch({
      type: "UPDATE_ONEUSERHOSTACTIVITYDATA",
      data: data,
    });
    console.log(userHostActivityDataRedux);

    setOpacity(0);
    setIsOpen(!isOpen);
  };

  let requirementFormat = [];
  let requirementArray = [];
  const [requirement, setRequirement] = useState(requirementFormat);
  requirement.forEach((data) => {
    requirementArray.push(data.value);
  });

  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "吉他", value: "吉他" },
    { label: "木箱鼓", value: "木箱鼓" },
    { label: "烏克麗麗", value: "烏克麗麗" },
    { label: "電吉他", value: "電吉他" },
  ];

  userHostActivityDataRedux.requirement.forEach((data) => {
    let requirement = {
      label: data,
      value: data,
    };
    requirementFormat.push(requirement);
  });

  const handleActivityChange = (e, type) => {
    if (type === "title") {
      setActivityData({ ...oneactivityData, title: e });
    }
    // if (type === "limit") {
    //   if (checked) {
    //     activityData.limit = 0;
    //   } else {
    //     activityData.limit = e;
    //   }
    // }
    if (type === "date") {
      setActivityData({ ...oneactivityData, date: e });
    }
    if (type === "time") {
      setActivityData({ ...oneactivityData, time: e });
    }
    if (type === "type") {
      setActivityData({ ...oneactivityData, type: e });
    }
    if (type === "level") {
      setActivityData({ ...oneactivityData, level: e });
    }
    if (type === "location") {
      setActivityData({ ...oneactivityData, location: e });
    }
    if (type === "comment") {
      setActivityData({ ...oneactivityData, comment: e });
    }
  };

  const handleNolimtChange = () => {};

  const handleDelete = async () => {
    const deleteActivity = await deleteActivityData(props.data.id);
    alert("已刪除活動");

    setOpacity(0);
    setIsOpen(!isOpen);
  };

  if (!props.data) {
    return "isLoading";
  }
  if (!oneactivityData) {
    return "isLoading";
  }

  const LimitboxHTML = () => {
    if (checked) {
      return (
        <div>
          <InputFieldInput
            type="number"
            defaultValue={limitInitial}
            disabled={checked}
            style={{ backgroundColor: "grey" }}
            // onChange={(e) => {
            //   oneactivityData.limit = 0;
            // }}
          ></InputFieldInput>
        </div>
      );
    } else {
      return (
        <div>
          <InputFieldInput
            type="number"
            defaultValue={userHostActivityDataRedux.limit}
            min="1"
            max="20"
            onChange={(e) => {
              oneactivityData.limit = e.target.value;
            }}
          ></InputFieldInput>
        </div>
      );
    }
  };
  const renderEditActivityField = () => {
    return (
      <EditActivityCol>
        <InputFieldDiv>
          <Label for="title">活動名稱</Label>
          <InputFieldInput
            id="title"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.title}
            onInput={(e) => {
              handleActivityChange(e.target.value, "title");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="date">活動日期</Label>
          <InputFieldInput
            id="date"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.date}
            type="date"
            onInput={(e) => {
              handleActivityChange(e.target.value, "date");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="time">活動時間</Label>
          <InputFieldInput
            id="time"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.time}
            type="time"
            onInput={(e) => {
              handleActivityChange(e.target.value, "time");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="type">音樂類型</Label>
          {/* <InputFieldInput
            id="type"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={props.data.type}
            onInput={(e) => {
              handleActivityChange(e.target.value, "type");
            }}
          ></InputFieldInput> */}
          <select
            defaultValue={userHostActivityDataRedux.type}
            onChange={(e) => {
              handleActivityChange(e.target.value, "type");
            }}
          >
            <option>流行</option>
            <option>嘻哈</option>
            <option>古典</option>
          </select>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="limit">人數限制</Label>
          {/* <InputFieldInput
            id="limit"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={props.data.limit}
            type="number"
            min="1"
            max="20"
            onInput={(e) => {
              handleActivityChange(e.target.value, "limit");
            }}
          ></InputFieldInput> */}
          {LimitboxHTML()}
          <input
            id="nolimit"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <label for="nolimit">無</label>
        </InputFieldDiv>
        <Label>樂器需求</Label>
        <MultiSelect
          options={options}
          value={requirement}
          onChange={setRequirement}
          labelledBy="Select"
        />
        <InputFieldDiv>
          <Label for="level">建議程度</Label>
          <InputFieldInput
            id="level"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.level}
            onInput={(e) => {
              handleActivityChange(e.target.value, "level");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="location">活動地點</Label>
          <InputFieldInput
            id="location"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.location}
            onInput={(e) => {
              handleActivityChange(e.target.value, "location");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        <InputFieldDiv>
          <Label for="comment">備註說明</Label>
          <InputFieldInput
            id="comment"
            contentEditable="true"
            suppressContentEditableWarning={true}
            defaultValue={userHostActivityDataRedux.comment}
            onInput={(e) => {
              handleActivityChange(e.target.value, "comment");
            }}
          ></InputFieldInput>
        </InputFieldDiv>
        {/* <InputFieldDiv>
          <Label for="activityImage">上傳照片</Label>
          <InputFieldInput type="file" id="activityImage"></InputFieldInput>
        </InputFieldDiv> */}
        <Btn
          onClick={(e) => {
            editConfirm();
          }}
        >
          確認修改
        </Btn>
        <Btn
          onClick={(e) => {
            handleDelete();
          }}
        >
          刪除活動
        </Btn>
      </EditActivityCol>
    );
  };

  return (
    <div>
      <Btn onClick={toggleModal}>編輯活動</Btn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <div>{renderEditActivityField()}</div>
        <button onClick={toggleCancel}>Close me</button>
      </StyledModal>
    </div>
  );
}

function EditActivitiesMemberButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
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
    setAttendantsData(allAttendants);
  };

  const handleAgree = (e) => {
    agreeJoinActivity(props.activityId, e.userId);

    const index = applicantsData.findIndex((data) => data.userId === e.userId);
    const newApplicantsData = [...applicantsData];
    const newAttendant = newApplicantsData.splice(index, 1);
    setApplicantsData(newApplicantsData);
    //加新的element到array
    setAttendantsData((attendantsData) => [...attendantsData, ...newAttendant]);
  };
  const handleKick = (e) => {
    kickActivity(props.activityId, e.userId);

    const index = attendantsData.findIndex((data) => data.userId === e.userId);
    const newAttendantsData = [...attendantsData];
    const removedAttendant = newAttendantsData.splice(index, 1);
    setAttendantsData(newAttendantsData);
  };

  useEffect(() => {
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
            <Btn
              onClick={() => {
                handleAgree(item);
              }}
            >
              同意
            </Btn>
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
            <Btn
              onClick={() => {
                handleKick(item);
              }}
            >
              踢
            </Btn>
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
      <Btn onClick={toggleModal}>查看申請</Btn>
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
  //   let userId = "SM7VM6CFOJOZwIDA6fjB";
  const [userData, setUserData] = useState();
  const [userActivities, setUserActivities] = useState();
  const [userJoinActivities, setUserJoinActivities] = useState([]);
  const userDataRedux = useSelector((state) => state.userData);
  const userHostActivityDataRedux = useSelector(
    (state) => state.userHostActivityData
  );
  const confirmArray = [];
  const dispatch = useDispatch();

  const getUserProfileData = async () => {
    const data = await getUserData(userId);
    dispatch({ type: "UPDATE_USERDATA", data: data });

    setUserData(data);
  };

  const getUserActivitiesData = async () => {
    const data = await getUserHostActivities(userId);
    dispatch({ type: "UPDATE_USERHOSTACTIVITYDATA", data: data });

    const attendActivities = await getUserJoinActivities(userId);

    const applyActivities = await getUserApplyActivities(userId);

    setUserJoinActivities((a) => [...a, ...attendActivities]);
    setUserJoinActivities((a) => [...a, ...applyActivities]);

    setUserActivities(data);
  };

  const renderProfile = () => {
    return (
      <div>
        <img src={`${userData.profileImage}`} />
        <div>{userDataRedux.name}</div>
        <div>{userDataRedux.intro}</div>
        <div>{userDataRedux.email}</div>
        <div>偏好類型：{userDataRedux.preferType}</div>
        <div>會的樂器：{userDataRedux.skill}</div>
        <div>{userDataRedux.favSinger}</div>
      </div>
    );
  };

  const handleEditProfile = () => {};

  function onEdit(arr) {
    if (arr.length === userDataRedux.length) {
      setUserActivities(arr);
    }
  }

  useEffect(() => {
    getUserProfileData();
    getUserActivitiesData();
  }, []);

  if (!userData) {
    return "isLoading";
  }
  if (!userActivities || !userJoinActivities) {
    return "isLoading";
  }

  const renderHostActivities = () => {
    if (userHostActivityDataRedux.length !== 0) {
      const activitiesHTML = userHostActivityDataRedux.map((data) => {
        return (
          <div>
            <div>{data.title}</div>
            <div>{data.host}</div>
            <div>{data.id}</div>
            <div>{data.requirement}</div>
            <EditActivitiesButton
              activityId={data.id}
              data={data}
              setUserActivities={setUserActivities}
              confirmArray={confirmArray}
              onEdit={onEdit}
            />
            <EditActivitiesMemberButton
              applicants={data.applicants}
              attendants={data.attendants}
              activityId={data.id}
            />
          </div>
        );
      });
      return activitiesHTML;
    } else {
      return <div>沒有開團</div>;
    }
  };

  const renderJoinActivities = () => {
    if (userJoinActivities.length !== 0) {
      const joinActivitiesHTML = userJoinActivities.map((data) => {
        const applyStatusHTML = () => {
          if (data.attendants.includes(userId)) {
            return <div style={{ backgroundColor: "green" }}>已加入</div>;
          } else if (data.applicants.includes(userId)) {
            return <div style={{ backgroundColor: "yellow" }}>申請中</div>;
          }
          return applyStatusHTML;
        };

        return (
          <div>
            <div>{data.title}</div>
            <div>{data.host}</div>
            <div>{data.id}</div>
            <div>
              <Link to={`/activities/${data.id}`}>
                <button>查看活動</button>
              </Link>
            </div>
            <div>{applyStatusHTML()}</div>
          </div>
        );
      });
      return joinActivitiesHTML;
    } else {
      return <div>未有活動</div>;
    }
  };

  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <div>
        <div>this is profile page</div>
        <ProfileContainer>
          <ActivitiesCol>
            <MyHostTitle>我的開團</MyHostTitle>
            <MyHost>{renderHostActivities()}</MyHost>

            <MyJoinTitle>我的跟團</MyJoinTitle>
            <MyJoin>{renderJoinActivities()}</MyJoin>
          </ActivitiesCol>

          <ProfileCol>
            {renderProfile()}
            <FancyModalButton data={userData} />
          </ProfileCol>
        </ProfileContainer>
      </div>
    </ModalProvider>
  );
}

export default Profile;
