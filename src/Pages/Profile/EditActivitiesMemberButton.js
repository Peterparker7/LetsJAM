import "../../App.css";
import styled from "styled-components";
import React, { useEffect, useState, useCallback } from "react";

import {
  getUserData,
  agreeJoinActivity,
  kickActivity,
  subscribe,
} from "../../utils/firebase";

import Modal from "styled-react-modal";
import InviteButton from "./InviteButton.js";
import MemberCard from "./MemberCard.js";
import xIcon from "../../images/x.svg";

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

  const getApplicantsDetail = useCallback(() => {
    let applicantsArray = [];

    const gettingApplicantsDetail = async () => {
      initApplicantsData.forEach((applicant) => {
        const promise = getUserData(applicant).then((data) => {
          return data;
        });
        applicantsArray.push(promise);
      });
      const allApplicants = await Promise.all(applicantsArray);
      setApplicantsData(allApplicants);
    };
    gettingApplicantsDetail();
  }, [initApplicantsData]);

  const getAttendantsDetail = useCallback(() => {
    let attendantsArray = [];

    const gettingAttendantsDetail = async () => {
      initAttendantsData.forEach((attendant) => {
        const promise = getUserData(attendant).then((data) => {
          return data;
        });
        attendantsArray.push(promise);
      });
      const allAttendants = await Promise.all(attendantsArray);
      setAttendantsData(allAttendants);
    };
    gettingAttendantsDetail();
  }, [initAttendantsData]);

  const handlefirebaseChange = useCallback(() => {
    const handlingfirebaseChange = async () => {
      setInitApplicantsData(activityChange.applicants);
      setInitAttendantsData(activityChange.attendants);
    };
    handlingfirebaseChange();
  }, [activityChange]);

  const handleAgree = (e) => {
    agreeJoinActivity(props.activityId, e.uid);

    const index = applicantsData.findIndex((data) => data.uid === e.uid);
    const newApplicantsData = [...applicantsData];
    const newAttendant = newApplicantsData.splice(index, 1);
    setApplicantsData(newApplicantsData);
    //?????????element???array
    setAttendantsData((attendantsData) => [...attendantsData, ...newAttendant]);
  };
  const handleKick = (e) => {
    kickActivity(props.activityId, e.uid);

    const index = attendantsData.findIndex((data) => data.uid === e.uid);
    const newAttendantsData = [...attendantsData];
    newAttendantsData.splice(index, 1);
    setAttendantsData(newAttendantsData);
  };

  useEffect(() => {
    getApplicantsDetail();
  }, [initApplicantsData, getApplicantsDetail]);
  useEffect(() => {
    getAttendantsDetail();
  }, [initAttendantsData, getAttendantsDetail]);
  useEffect(() => {
    const unsubscribe = subscribe(setActivityChange, props.data.id);
    return unsubscribe;
  }, [props.data.id]);
  useEffect(() => {
    if (activityChange) {
      if (activityChange.applicants || activityChange.attendants) {
        handlefirebaseChange();
      }
    }
  }, [activityChange, handlefirebaseChange]);

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

  if (!initApplicantsData) {
    return "isLoading";
  }

  const renderApplicants = () => {
    if (applicantsData.length !== 0) {
      const applicantsHTML = applicantsData.map((item, index) => {
        return (
          <EachMemberDiv key={item}>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />

              <MemberCard data={item} />
            </MemberContainer>
            <MemberName>{item.name}</MemberName>

            <BtnAccept
              onClick={() => {
                handleAgree(item);
              }}
            >
              ??????
            </BtnAccept>
          </EachMemberDiv>
        );
      });
      return applicantsHTML;
    } else {
      return <NoMember>???????????????</NoMember>;
    }
  };

  const renderAttendants = () => {
    if (attendantsData.length !== 0) {
      const attendantsHTML = attendantsData.map((item) => {
        return (
          <EachMemberDiv key={item}>
            <MemberContainer>
              <MemberImg src={`${item.profileImage}`} alt="" />
              <MemberCard data={item} />
            </MemberContainer>
            <MemberName>{item.name}</MemberName>

            <BtnKick
              onClick={() => {
                handleKick(item);
              }}
            >
              ???
            </BtnKick>
          </EachMemberDiv>
        );
      });
      return attendantsHTML;
    } else {
      return <NoMember>??????????????????</NoMember>;
    }
  };

  return (
    <div>
      <CheckApplicantBtn onClick={toggleModal}>????????????</CheckApplicantBtn>
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
            <CloseIcon src={xIcon} onClick={toggleModal} />
          </CloseIconContainer>

          <ContentTitle>????????????</ContentTitle>

          <EditMemberCol>
            <ApplicantTitle>?????????</ApplicantTitle>
            <MemberDivField>{renderApplicants()}</MemberDivField>
            <AttendantTitle>???????????????</AttendantTitle>
            <MemberDivField>{renderAttendants()}</MemberDivField>

            <InviteButtonContainer>
              ?????????????????? ??????
              <InviteButton data={props} />
            </InviteButtonContainer>
          </EditMemberCol>
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
  color: #ff00ff;

  &:hover {
    background: #ff00ff;
    box-shadow: 0 0 10px #ff00ff;
    color: white;

    transform: translateY(-2px);
  }
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

  box-shadow: 0 0 5px #ff00ff;
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff,
    0 0 40px #ff00ff;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
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
