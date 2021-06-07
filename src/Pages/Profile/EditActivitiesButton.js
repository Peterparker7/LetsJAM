// import "../../App.css";
import "./EditActivitiesButton.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getSpecificData,
  deleteActivityData,
  updateActivitiesData,
  getAllUser,
  updateInvitation,
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import xIconBlack from "../../images/xBlack.svg";

const StyledMultiSelect = styled(MultiSelect)`
  border-bottom: 1px solid #979797;
  --rmsc-border: unset !important;
  --rmsc-bg: #fff8f8;
  --rmsc-hover: #ff00ff96;
  --rmsc-selected: #43ede8a6;
  --rmsc-h: 40px !important;
  color: black;
  text-align: left;
`;
const StyledModal = Modal.styled`
width: 35rem;
height: 80%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #fff8f8;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
position: relative;
overflow-y: auto;
border-top: 6px solid #43e8d8;
border-radius: 4px;`;

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

    let date = oneactivityData.date;
    let time = oneactivityData.time;
    let newTimestamp = new Date(`${date}T${time}`);
    let timestampformat = Date.parse(newTimestamp);

    console.log(date);
    console.log(time);
    console.log(newTimestamp);
    console.log(`${date}T${time}`);
    console.log(timestampformat);
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

  const editConfirm = async () => {
    if (checked) {
      oneactivityData.limit = 0;
    } else if (!checked && oneactivityData.limit === 0) {
      oneactivityData.limit = 1;
    }
    console.log(oneactivityData.limit);
    let date = oneactivityData.date;
    let time = oneactivityData.time;
    let newTimestamp = new Date(`${date}T${time}`);
    let timestampformat = Date.parse(newTimestamp);

    let data = {
      id: props.data.id,
      title: oneactivityData.title,
      limit: parseInt(oneactivityData.limit),
      date: oneactivityData.date,
      time: oneactivityData.time,
      newTimestamp: newTimestamp,
      timestamp: newTimestamp,
      type: oneactivityData.type,
      level: oneactivityData.level,
      location: oneactivityData.location,
      comment: oneactivityData.comment,
      fileSource: oneactivityData.fileSource,
      requirement: requirementArray,
      youtubeSource: oneactivityData.youtubeSource,
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
    // if (type === "limit") {
    //   setActivityData({ ...oneactivityData, comment: e });
    // }
  };

  const handleNolimtChange = () => {};

  const handleDelete = async () => {
    Swal.fire({
      title: "<div style=font-size:24px>確定要刪除嗎?</div>",
      // text: "刪除後將無法復原",
      customClass: "customTitle",
      background: "black",
      // html: "<div style=color:#595959;>刪除後將無法復原</div>",
      showCancelButton: true,
      confirmButtonColor: "#43e8d8",
      cancelButtonColor: "#565656",
      confirmButtonText: "<span  style=color:#000>確定刪除</span",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        handleActivityInvitationDelete();
        const deleteActivity = deleteActivityData(props.data.id);
        // alert("已刪除活動");
        dispatch({
          type: "DELETE_ACTIVITYDATA",
          data: props.data,
        });
        setOpacity(0);
        setIsOpen(!isOpen);
      }
    });
  };
  const handleActivityInvitationDelete = async () => {
    const allUserData = await getAllUser();
    const newAll = allUserData.map((item) => {
      const newItem = item.invitation.filter(
        (invitation) => invitation.id !== props.data.id
      );
      item.invitation = newItem;

      const update = updateInvitation(newItem, item.uid);
      return item;
    });
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
          <LimitInputField
            type="number"
            defaultValue={limitInitial}
            disabled={checked}
            style={{ opacity: 0.3 }}
            // onChange={(e) => {
            //   oneactivityData.limit = 0;
            // }}
          ></LimitInputField>
        </div>
      );
    } else {
      return (
        <div>
          <LimitInputField
            type="number"
            defaultValue={
              userHostActivityDataRedux.limit !== 0
                ? userHostActivityDataRedux.limit
                : 1
            }
            min="1"
            max="20"
            onChange={(e) => {
              oneactivityData.limit = e.target.value;
            }}
          ></LimitInputField>
        </div>
      );
    }
  };
  const renderEditActivityField = () => {
    return (
      <EditActivityCol>
        <EditActivityDetail>
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
            <SelectType
              defaultValue={userHostActivityDataRedux.type}
              onChange={(e) => {
                handleActivityChange(e.target.value, "type");
              }}
            >
              <option>流行</option>
              <option>嘻哈</option>
              <option>古典</option>
            </SelectType>
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
            <LimitCheckBoxField
              id="nolimit"
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <label for="nolimit">無</label>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>樂器需求</Label>
            <StyledMultiSelect
              className="EditActivitiesMulti"
              options={options}
              overrideStrings={override}
              value={requirement}
              onChange={setRequirement}
              labelledBy="Select"
            />
          </InputFieldDiv>
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
        </EditActivityDetail>
        <EditActivityButtonDiv>
          <BtnConfirm
            onClick={(e) => {
              editConfirm();
            }}
          >
            確認修改
          </BtnConfirm>
          <BtnCancel
            onClick={(e) => {
              handleDelete();
            }}
          >
            刪除活動
          </BtnCancel>
        </EditActivityButtonDiv>
      </EditActivityCol>
    );
  };

  return (
    <div>
      <EditBtn onClick={toggleModal}>編輯活動</EditBtn>
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
          <CloseIconContainer>
            <CloseIcon src={xIconBlack} onClick={toggleCancel} />
          </CloseIconContainer>
          {/* <TopBar></TopBar> */}
          <ContentTitle>編輯活動內容</ContentTitle>
          {renderEditActivityField()}
        </Container>
        {/* <BtnClose onClick={toggleCancel}>+</BtnClose> */}
      </StyledModal>
    </div>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff8f8;
  position: relative;
`;
const TopBar = styled.div`
  height: 6px;
  width: 100%;
  background: #ff0099;
`;
const ContentTitle = styled.div`
  color: black;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  margin: 20px;
  padding: 10px;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 15px;
  right: 15px;
  z-index: 5;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #979797;
  }
`;
const CloseIcon = styled.img`
  width: 100%;
`;

const InputFieldDiv = styled.div`
  /* text-align: left; */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const InputFieldInput = styled.input`
  border-bottom: 1px solid #979797;
  height: 40px;
  width: calc(100% - 80px);
  padding: 5px;
`;
const EditActivityCol = styled.div`
  width: 80%;
  margin: 0 auto 40px auto;
  padding-bottom: 20px;
`;
const EditActivityDetail = styled.div`
  /* text-align: left;
  width: 300px; */
  max-width: 400px;
  margin: 20px auto;
`;
const LimitInputField = styled.input`
  width: 50px;
  height: 40px;
  padding: 5px;
  border-bottom: 1px solid #979797;
`;
const LimitCheckBoxField = styled.input`
  width: 30px;
`;
const SelectType = styled.select`
  width: calc(100% - 80px);
  padding: 5px;
  height: 40px;
  border-bottom: 1px solid #979797;
`;
const EditActivityButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 40px 50px;
`;
const Label = styled.label`
  /* margin-right: 10px; */
  width: 80px;
  /* display: inline-block; */
`;

const Btn = styled.button`
  border: 1px solid #979797;
  border-radius: 8px;
  padding: 12px 40px;
  transition: 0.2s;

  cursor: pointer;
`;
const BtnConfirm = styled(Btn)`
  border: 1px solid #43e8d8;
  padding: 12px 40px;
  cursor: pointer;
  color: #000;
  background: #43e8d8;
  transition: 0.2s;

  &:hover {
    border: 1px solid #4cffee;
    box-shadow: 0 0 10px #43e8d8;

    background: #4cffee;
    transform: translateY(-2px);
  }
`;
const BtnCancel = styled(Btn)`
  background: #565656;
  color: #fff;

  &:hover {
    background: #272727;
    transform: translateY(-2px);
  }
`;
const EditBtn = styled.button`
  /* border: 1px solid #979797; */
  border-radius: 8px;
  width: 90px;
  height: 40px;
  padding: 5px;
  /* background: #ff00ff; */
  background: #565656;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #272727;
    transform: translateY(-2px);
  }
  @media (max-width: 414px) {
    font-size: 14px;
    padding: 2px;
    width: 70px;

    height: 30px;
  }
`;
const BtnClose = styled.button`
  position: absolute;
  transform: rotate(0.125turn);
  font-size: 28px;
  top: 10px;
  right: 30px;
  cursor: pointer;
`;

export default EditActivitiesButton;
