import "./EditActivitiesButton.css";
import styled from "styled-components";
import React, { useEffect, useState, useCallback } from "react";
import {
  getSpecificData,
  deleteActivityData,
  updateActivitiesData,
  getAllUser,
  updateInvitation,
} from "../../utils/firebase";

import Modal from "styled-react-modal";
import MultiSelect from "react-multi-select-component";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Warning from "./Validate";

import Swal from "sweetalert2";
import xIconBlack from "../../images/xBlack.svg";
import { SelectTypeWhiteEditHTML } from "../../Components/SelectComponent";
import {
  MaterialUIPickersTimeActivity,
  MaterialUIPickersDateActivity,
} from "../../Components/DateTimePicker";

const StyledMultiSelect = styled(MultiSelect)`
  border-bottom: 1px solid #979797;
  --rmsc-border: unset !important;
  --rmsc-bg: #f8f8ff;
  --rmsc-hover: #efefef;
  --rmsc-selected: #43ede8;
  --rmsc-h: 40px !important;
  --rmsc-main: none;
  --rmsc-p: 5px;

  color: black;
  text-align: left;

  .dropdown-content {
  }

  .dropdown-heading {
    cursor: pointer;
  }

  .item-renderer {
    padding: 10px 5px;
  }
`;
const StyledModal = Modal.styled`
width: 35rem;
height: 80%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #f8f8ff;
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

  const [validationResult, setValidationResult] = useState(true);

  const getActivity = useCallback(() => {
    const gettingActivity = async () => {
      const data = await getSpecificData(props.data.id);
      setActivityData(data);
    };
    gettingActivity();
  }, [props.data.id]);

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
  }, [getActivity, userHostActivityDataRedux.limit]);

  function toggleModal(e) {
    setOpacity(0);
    setIsOpen(!isOpen);
  }

  function toggleCancel(e) {
    setOpacity(0);
    setIsOpen(!isOpen);

    setActivityData({
      ...oneactivityData,
      title: userHostActivityDataRedux.title,
      date: userHostActivityDataRedux.date,
      time: userHostActivityDataRedux.time,
      level: userHostActivityDataRedux.level,
      location: userHostActivityDataRedux.location,
    });

    setRequirement(requirementFormat);
    if (userHostActivityDataRedux.limit === 0) {
      setChecked(true);
    } else if (userHostActivityDataRedux.limit !== 0) {
      props.data.limit = userHostActivityDataRedux.limit;
      setChecked(false);
    }
    setValidationResult(true);
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

  const inputValidation = () => {
    let nowDate = new Date();
    let a = oneactivityData.time.split(":");
    let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
    let deviation = 8 * 60 * 60000;
    if (
      oneactivityData.title.length === 0 ||
      oneactivityData.title.length > 10 ||
      nowDate >= Date.parse(oneactivityData.date) + 16 * 60 * 60000 ||
      nowDate >= Date.parse(oneactivityData.date) + milliseconds - deviation ||
      requirement.length === 0 ||
      oneactivityData.level.length > 20 ||
      oneactivityData.location.length === 0 ||
      oneactivityData.location.length > 30
    ) {
      setValidationResult(false);
      return false;
    } else {
      setValidationResult(true);

      return true;
    }
  };

  const editConfirm = async () => {
    if (checked) {
      oneactivityData.limit = 0;
    } else if (!checked && oneactivityData.limit === 0) {
      oneactivityData.limit = 1;
    }
    let date = oneactivityData.date;
    let time = oneactivityData.time;
    let newTimestamp = new Date(`${date}T${time}`);

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
    if (inputValidation()) {
      updateActivitiesData(data, props.data.id);

      dispatch({
        type: "UPDATE_ONEUSERHOSTACTIVITYDATA",
        data: data,
      });

      setOpacity(0);
      setIsOpen(!isOpen);
    }
  };

  let requirementFormat = [];
  let requirementArray = [];
  const [requirement, setRequirement] = useState(requirementFormat);
  requirement.forEach((data) => {
    requirementArray.push(data.value);
  });
  let override = {
    allItemsAreSelected: "????????????",
    clearSearch: "Clear Search",
    noOptions: "No options",
    search: "??????",
    selectAll: "??????",
    selectSomeItems: "???????????????",
  };
  const options = [
    { label: "Vocal", value: "Vocal" },
    { label: "??????", value: "??????" },
    { label: "?????????", value: "?????????" },
    { label: "?????????", value: "?????????" },
    { label: "??????", value: "??????" },
    { label: "??????", value: "??????" },
    { label: "?????????", value: "?????????" },
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

  const handleDelete = async () => {
    Swal.fire({
      title: "<div style=font-size:24px>???????????????????</div>",
      customClass: "customTitle",
      background: "black",
      showCancelButton: true,
      confirmButtonColor: "#43e8d8",
      cancelButtonColor: "#565656",
      confirmButtonText: "<span  style=color:#000>????????????</span",
      cancelButtonText: "??????",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setOpacity(0);
        setIsOpen(!isOpen);
        Swal.fire({
          title: "<span style=font-size:24px>?????????</span>",
          customClass: "customTitle",
          background: "black",
          showConfirmButton: false,
          timer: 2000,
        });
        await handleActivityInvitationDelete();
        await deleteActivityData(props.data.id);
        dispatch({
          type: "DELETE_ACTIVITYDATA",
          data: props.data,
        });
      }
    });
  };
  const handleActivityInvitationDelete = async () => {
    const allUserData = await getAllUser();
    allUserData.forEach((item) => {
      const newItem = item.invitation.filter(
        (invitation) => invitation.id !== props.data.id
      );
      item.invitation = newItem;

      updateInvitation(newItem, item.uid);
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
            <Label htmlFor="title">????????????</Label>
            <InputFieldInput
              id="title"
              contentEditable="true"
              suppressContentEditableWarning={true}
              defaultValue={userHostActivityDataRedux.title}
              onInput={(e) => {
                handleActivityChange(e.target.value, "title");
              }}
            ></InputFieldInput>
            {Warning.warningTitleHTML(
              oneactivityData.title,
              userHostActivityDataRedux.title
            )}
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="date">????????????</Label>
            <MaterialUIPickersDateActivity
              defaultValue={userHostActivityDataRedux.date}
              handleActivityChange={handleActivityChange}
            />
            {Warning.warningDateHTML(
              oneactivityData.date,
              userHostActivityDataRedux.date
            )}
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="time">????????????</Label>
            <MaterialUIPickersTimeActivity
              defaultDate={userHostActivityDataRedux.date}
              defaultValue={userHostActivityDataRedux.time}
              handleActivityChange={handleActivityChange}
            />
            {Warning.warningTimeHTML(
              oneactivityData.date,
              oneactivityData.time
            )}
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="type">????????????</Label>
            <SelectTypeWhiteEditHTML
              defaultValue={userHostActivityDataRedux.type}
              handleActivityChange={handleActivityChange}
            />
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="limit">????????????</Label>
            {LimitboxHTML()}
            <LimitCheckBoxField
              id="nolimit"
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <label htmlFor="nolimit">???</label>
          </InputFieldDiv>
          <InputFieldDiv>
            <Label>????????????</Label>
            <StyledMultiSelect
              className="EditActivitiesMulti"
              options={options}
              disableSearch={true}
              overrideStrings={override}
              value={requirement}
              onChange={setRequirement}
              labelledBy="Select"
            />
            {Warning.warningRequirementHTML(requirement)}
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="level">????????????</Label>
            <InputFieldInput
              id="level"
              contentEditable="true"
              suppressContentEditableWarning={true}
              defaultValue={userHostActivityDataRedux.level}
              onInput={(e) => {
                handleActivityChange(e.target.value, "level");
              }}
            ></InputFieldInput>
            {Warning.warningLevelHTML(oneactivityData.level)}
          </InputFieldDiv>
          <InputFieldDiv>
            <Label htmlFor="location">????????????</Label>
            <InputFieldInput
              id="location"
              contentEditable="true"
              suppressContentEditableWarning={true}
              defaultValue={userHostActivityDataRedux.location}
              onInput={(e) => {
                handleActivityChange(e.target.value, "location");
              }}
            ></InputFieldInput>
            {Warning.warningLocationHTML(oneactivityData.location)}
          </InputFieldDiv>
          <InputFieldDiv style={{ alignItems: "baseline" }}>
            <Label htmlFor="comment">????????????</Label>
            <InputTextArea
              id="comment"
              contentEditable="true"
              suppressContentEditableWarning={true}
              defaultValue={userHostActivityDataRedux.comment}
              onInput={(e) => {
                handleActivityChange(e.target.value, "comment");
              }}
            ></InputTextArea>
          </InputFieldDiv>
        </EditActivityDetail>
        <EditActivityButtonDiv>
          <BtnConfirm
            onClick={(e) => {
              editConfirm();
            }}
          >
            ????????????
            <ValidationResult
              style={
                !validationResult ? { display: "block" } : { display: "none" }
              }
            >
              ?????????????????????????????????
            </ValidationResult>
          </BtnConfirm>
          <BtnCancel
            onClick={(e) => {
              handleDelete();
            }}
          >
            ????????????
          </BtnCancel>
        </EditActivityButtonDiv>
      </EditActivityCol>
    );
  };

  return (
    <div>
      <EditBtn onClick={toggleModal}>????????????</EditBtn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleCancel}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <Container>
          <CloseIconContainer>
            <CloseIcon src={xIconBlack} onClick={toggleCancel} />
          </CloseIconContainer>
          <ContentTitle>??????????????????</ContentTitle>
          {renderEditActivityField()}
        </Container>
      </StyledModal>
    </div>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f8ff;
  position: relative;
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
    background: #e8e8e8;
  }
`;
const CloseIcon = styled.img`
  width: 100%;
`;

const InputFieldDiv = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
`;
const InputFieldInput = styled.input`
  border-bottom: 1px solid #979797;
  height: 40px;
  width: calc(100% - 80px);
  padding: 5px;
`;

const InputTextArea = styled.textarea`
  width: calc(100% - 80px);
  height: 80px;
  border: 1px solid #979797;
  padding: 5px;
  resize: none;
  line-height: 20px;
  white-space: pre-line;
`;
const EditActivityCol = styled.div`
  width: 80%;
  margin: 0 auto 40px auto;
  padding-bottom: 20px;
  @media (max-width: 414px) {
    width: 90%;
  }
`;
const EditActivityDetail = styled.div`
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

const EditActivityButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 40px 50px;

  @media (max-width: 576px) {
    margin: 40px auto;
  }
  @media (max-width: 414px) {
    justify-content: space-between;
  }
`;
const ValidationResult = styled.div`
  position: absolute;
  color: red;
  font-size: 12px;
  bottom: -20px;
  left: 5px;
  @media (max-width: 576px) {
    bottom: -25px;
    left: 5px;
  }
`;
const Label = styled.label`
  width: 80px;
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
  position: relative;

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
  border-radius: 8px;
  width: 90px;
  height: 40px;
  padding: 5px;
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
    width: 90px;

    height: 30px;
  }
`;

export default EditActivitiesButton;
