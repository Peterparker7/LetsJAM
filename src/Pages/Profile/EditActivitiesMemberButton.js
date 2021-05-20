import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getSpecificData } from "./utils/firebase";
// import { joinActivity } from "./utils/firebase";
import {
  getUserData,
  agreeJoinActivity,
  kickActivity,
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";

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

const Btn = styled.button`
  border: 1px solid #979797;
  padding: 5px;
  cursor: pointer;
`;

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

export default EditActivitiesMemberButton;
