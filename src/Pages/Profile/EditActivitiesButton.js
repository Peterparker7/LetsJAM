import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getSpecificData,
  deleteActivityData,
  updateActivitiesData,
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
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

const InputFieldDiv = styled.div`
  text-align: left;
`;
const InputFieldInput = styled.input`
  border: 1px solid #979797;
`;
const EditActivityCol = styled.div`
  margin: 0 auto;
`;
const Label = styled.label`
  margin-right: 10px;
`;

const Btn = styled.button`
  border: 1px solid #979797;
  padding: 5px;
  cursor: pointer;
`;

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

export default EditActivitiesButton;