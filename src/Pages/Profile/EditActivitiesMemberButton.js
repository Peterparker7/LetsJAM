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
import xIcon from "../../images/x.svg";
import { Animated } from "react-animated-css";

const StyledModal = Modal.styled`
width: 35rem;
height: 70%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #fff8f8;
opacity: ${(props) => props.opacity};
overflow-y: auto;
transition : all 0.3s ease-in-out;
border-radius: 4px;
background: #121212;
color: white;
border-top: 6px solid #ff00ff;
`;

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
      const applicantsHTML = applicantsData.map((item, index) => {
        return (
          // <Animated
          //   animationIn="fadeIn"
          //   // animationOut="fadeOut"
          //   isVisible={true}
          //   animationInDelay={index * 50}
          // >
          <EachMemberDiv>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />

              <MemberName>{item.name}</MemberName>
              <MemberCard data={item} />
            </MemberContainer>
            <BtnAccept
              onClick={() => {
                handleAgree(item);
              }}
            >
              同意
            </BtnAccept>
          </EachMemberDiv>
          // </Animated>
        );
      });
      return applicantsHTML;
    } else {
      return <NoMember>沒有申請者</NoMember>;
    }
  };

  const renderAttendants = () => {
    if (attendantsData.length !== 0) {
      const attendantsHTML = attendantsData.map((item) => {
        return (
          <EachMemberDiv>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />
              <MemberName>{item.name}</MemberName>
              <MemberCard data={item} />
            </MemberContainer>

            <BtnKick
              onClick={() => {
                handleKick(item);
              }}
            >
              踢
            </BtnKick>
          </EachMemberDiv>
        );
      });
      return attendantsHTML;
    } else {
      return <NoMember>尚未有出席者</NoMember>;
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
        <Container>
          {/* <ContentContainer> */}
          {/* <TopBar></TopBar> */}
          <CloseIconContainer>
            <CloseIcon src={xIcon} onClick={toggleModal} />
          </CloseIconContainer>

          <ContentTitle>成員一覽</ContentTitle>

          <EditMemberCol>
            <ApplicantTitle>申請中</ApplicantTitle>
            <MemberDivField>{renderApplicants()}</MemberDivField>
            <AttendantTitle>已加入成員</AttendantTitle>
            <MemberDivField>{renderAttendants()}</MemberDivField>

            {/* <BtnClose onClick={toggleModal}>+</BtnClose> */}
            <InviteButtonContainer>
              找不到成員？ 試試
              <InviteButton data={props} />
            </InviteButtonContainer>
          </EditMemberCol>
          {/* </ContentContainer> */}
        </Container>
      </StyledModal>
    </div>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const TopBar = styled.div`
  height: 6px;
  width: 100%;
  background: #ff00ff;
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
  transition: 0.1s;
  &:hover {
    background: #2d2d2d;
  }
`;
const CloseIcon = styled.img`
  width: 100%;
`;
// const ContentContainer = styled.div`
//   height: 100%;
// `;
const ContentTitle = styled.div`
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  margin: 20px;
  padding: 10px;
`;
const EditMemberCol = styled.div`
  text-align: left;
  /* width: 80%; */
  height: 90%;
  position: relative;
  margin: 30px 20px;
  padding-bottom: 20px;
`;
const ApplicantTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const AttendantTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const MemberDivField = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  min-height: 150px;
`;
const EachMemberDiv = styled.div`
  width: 120px;
  text-align: center;
  margin-top: 20px;
  line-height: 20px;
`;
const MemberContainer = styled.div`
  position: relative;
  width: 80px;
  text-align: center;
  margin: 0 auto;
`;
const NoMember = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin: auto auto;
`;
const MemberImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  &:hover {
    transform: scale(1.1);
  }
`;
const MemberName = styled.div`
  line-height: 30px;
`;
const Btn = styled.button`
  border: 1px solid #979797;
  border-radius: 8px;
  padding: 6px 8px;
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
`;
const BtnAccept = styled(Btn)`
  border: none;

  background: #43e8d8;
  transition: 0.2s;

  &:hover {
    background: #4cffee;
    box-shadow: 0 0 10px #4cffee;

    transform: translateY(-2px);
  }
`;
const BtnKick = styled(Btn)`
  border: 1px solid #ff00ff;
  /* background: #ff00ff; */
  color: #ff00ff;
  /* text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff; */

  &:hover {
    background: #ff00ff;
    box-shadow: 0 0 10px #ff00ff;
    color: white;

    transform: translateY(-2px);
  }
`;
const BtnClose = styled.button`
  transform: rotate(0.125turn);
  font-size: 28px;
  position: absolute;
  top: -10px;
  right: -30px;
  cursor: pointer;
`;
const InviteButtonContainer = styled.div`
  padding-bottom: 50px;
  align-items: center;
  display: flex;
`;
const CheckApplicantBtn = styled.button`
  border: 1px solid #ff00ff;
  border-radius: 10px;
  width: 90px;
  height: 40px;
  padding: 5px;
  color: white;
  /* background: #ffff00; */
  /* background: #ffe700; */
  box-shadow: 0 0 5px #ff00ff;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    /* background: #fff05c; */
    background: #ff00ff;
    color: white;
    transform: translateY(-2px);
  }
  @media (max-width: 414px) {
    font-size: 14px;
    padding: 2px;
    width: 90px;

    height: 30px;
  }
`;

export default EditActivitiesMemberButton;
