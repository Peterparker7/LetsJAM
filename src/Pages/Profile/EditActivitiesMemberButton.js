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
  subscribe,
} from "../../utils/firebase";

import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";
import InviteButton from "./InviteButton.js";
import MemberCard from "./MemberCard.js";
import { setIn } from "formik";

const StyledModal = Modal.styled`
width: 30rem;
height: 30rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
overflow-y: scroll;
transition : all 0.3s ease-in-out;`;

function EditActivitiesMemberButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [applicantsData, setApplicantsData] = useState([]);
  const [attendantsData, setAttendantsData] = useState([]);
  const [activityChange, setActivityChange] = useState([]);
  const [initApplicantsData, setInitApplicantsData] = useState(
    props.data.applicants
  );
  const [initAttendantsData, setInitAttendantsData] = useState(
    props.data.attendants
  );
  let applicantsArray = [];
  let attendantsArray = [];

  const getApplicantsDetail = async () => {
    initApplicantsData.forEach((applicant) => {
      const promise = getUserData(applicant).then((data) => {
        return data;
      });
      applicantsArray.push(promise);
    });
    const allApplicants = await Promise.all(applicantsArray);
    setApplicantsData(allApplicants);
  };
  const getAttendantsDetail = async () => {
    initAttendantsData.forEach((attendant) => {
      const promise = getUserData(attendant).then((data) => {
        return data;
      });
      attendantsArray.push(promise);
    });
    const allAttendants = await Promise.all(attendantsArray);
    setAttendantsData(allAttendants);
  };

  const handlefirebaseChange = async () => {
    setInitApplicantsData(activityChange.applicants);
    setInitAttendantsData(activityChange.attendants);
  };

  const handleAgree = (e) => {
    agreeJoinActivity(props.activityId, e.uid);

    const index = applicantsData.findIndex((data) => data.uid === e.uid);
    const newApplicantsData = [...applicantsData];
    const newAttendant = newApplicantsData.splice(index, 1);
    setApplicantsData(newApplicantsData);
    //加新的element到array
    setAttendantsData((attendantsData) => [...attendantsData, ...newAttendant]);
  };
  const handleKick = (e) => {
    kickActivity(props.activityId, e.uid);

    const index = attendantsData.findIndex((data) => data.uid === e.uid);
    const newAttendantsData = [...attendantsData];
    const removedAttendant = newAttendantsData.splice(index, 1);
    setAttendantsData(newAttendantsData);
  };

  useEffect(() => {
    getApplicantsDetail();
  }, [initApplicantsData]);
  useEffect(() => {
    getAttendantsDetail();
  }, [initAttendantsData]);
  useEffect(() => {
    subscribe(setActivityChange, props.data.id);
  }, []);
  useEffect(() => {
    if (activityChange) {
      if (activityChange.applicants || activityChange.attendants) {
        handlefirebaseChange();
      }
    }
  }, [activityChange]);

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
  //加了下面 刪除活動時查看申請button會出現isLoading
  // if (!activityChange) {
  //   return "isLoading";
  // }
  if (!initApplicantsData) {
    return "isLoading";
  }

  const renderApplicants = () => {
    if (applicantsData.length !== 0) {
      const applicantsHTML = applicantsData.map((item) => {
        return (
          <EachMemberDiv>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />

              <div>{item.name}</div>
              <MemberCard data={item} />
            </MemberContainer>
            <Btn
              onClick={() => {
                handleAgree(item);
              }}
            >
              同意
            </Btn>
          </EachMemberDiv>
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
          <EachMemberDiv>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />
              <div>{item.name}</div>
              <MemberCard data={item} />
            </MemberContainer>

            <Btn
              onClick={() => {
                handleKick(item);
              }}
            >
              踢
            </Btn>
          </EachMemberDiv>
        );
      });
      return attendantsHTML;
    } else {
      return <div>尚未有出席者</div>;
    }
  };

  return (
    <div>
      <CheckApplicantBtn onClick={toggleModal}>查看申請</CheckApplicantBtn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <EditMemberCol>
          <ApplicantTitle>申請中</ApplicantTitle>
          <MemberDivField>{renderApplicants()}</MemberDivField>
          <AttendantTitle>已加入成員</AttendantTitle>
          <MemberDivField>{renderAttendants()}</MemberDivField>

          <BtnClose onClick={toggleModal}>+</BtnClose>
          <span>找不到成員？ 試試</span>
          <InviteButton data={props} />
        </EditMemberCol>
      </StyledModal>
    </div>
  );
}

const EditMemberCol = styled.div`
  text-align: left;
  width: 80%;
  height: 90%;
  position: relative;
`;
const ApplicantTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
`;
const AttendantTitle = styled.div`
  font-size: 20px;
  border-bottom: 1px solid #979797;
`;
const MemberDivField = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;
const EachMemberDiv = styled.div`
  width: 95px;
  text-align: center;
  margin-top: 10px;
`;
const MemberContainer = styled.div`
  position: relative;
  width: 80px;
  text-align: center;
  margin: 0 auto;
`;
const MemberImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;
const Btn = styled.button`
  border: 1px solid #979797;
  border-radius: 10px;
  padding: 2.5px 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
`;
const BtnClose = styled.button`
  transform: rotate(0.125turn);
  font-size: 28px;
  position: absolute;
  top: -10px;
  right: -30px;
  cursor: pointer;
`;
const CheckApplicantBtn = styled.button`
  border: 1px solid none;
  border-radius: 10px;
  width: 90px;
  height: 40px;
  padding: 5px;
  background: #ffff00;
  cursor: pointer;
  @media (max-width: 414px) {
    font-size: 14px;
    padding: 2px;
    width: 70px;

    height: 30px;
  }
`;

export default EditActivitiesMemberButton;
