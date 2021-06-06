import Modal from "styled-react-modal";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { getAllUser, sendUserInvite, subscribe } from "../../utils/firebase";

import MemberCard from "./MemberCard.js";
import xIcon from "../../images/x.svg";

const StyledModal = Modal.styled`
  width: 40rem;
  height:80%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #121212;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
overflow-y: scroll;
border-radius: 4px;
border-top: 6px solid #ff00ff;
`;

function InviteButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const [allUserData, setAllUserDate] = useState();
  const [requireInstrument, setRequireInstrument] = useState();
  const [activityChange, setActivityChange] = useState();

  let activityDetail = props.data.data;

  function toggleModal(e) {
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

  const handleRequirement = (e) => {
    setRequireInstrument(e);
  };
  const renderCheckboxField = () => {
    return (
      <RequirementField>
        <RequirementDiv>
          <Label for="vocal">Vocal</Label>
          <input
            id="vocal"
            type="radio"
            name={"requireInstrument"}
            value={"Vocal"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
        <RequirementDiv>
          <Label for="guitar">吉他</Label>
          <input
            id="guitar"
            type="radio"
            name={"requireInstrument"}
            value={"吉他"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
        <RequirementDiv>
          <Label for="electricguitar">電吉他</Label>
          <input
            id="electricguitar"
            type="radio"
            name={"requireInstrument"}
            value={"電吉他"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
        <RequirementDiv>
          <Label for="bass">Bass</Label>
          <input
            id="bass"
            type="radio"
            name={"requireInstrument"}
            value={"bass"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
        <RequirementDiv>
          <Label for="piano">Piano</Label>
          <input
            id="piano"
            type="radio"
            name={"requireInstrument"}
            value={"piano"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
        <RequirementDiv>
          <Label for="drum">木箱鼓</Label>
          <input
            id="drum"
            type="radio"
            name={"requireInstrument"}
            value={"木箱鼓"}
            onChange={(e) => {
              handleRequirement(e.target.value);
            }}
          />
        </RequirementDiv>
      </RequirementField>
    );
  };

  const sendInvite = async (uid) => {
    let data = {
      id: activityDetail.id,
      message: "Let's JAM!!",
    };
    sendUserInvite(data, uid);
  };

  const renderAllUser = () => {
    const userAttend = allUserData.filter((item) => {
      if (activityChange.attendants.includes(item.uid)) return item;
    });
    const userApply = allUserData.filter((item) => {
      if (activityChange.applicants.includes(item.uid)) return item;
    });

    const excludeAttendants = allUserData.filter(
      (item) => !userAttend.some((j) => item.uid === j.uid)
    );
    const restUser = excludeAttendants.filter(
      (item) => !userApply.some((j) => item.uid === j.uid)
    );

    const filterUser = restUser.filter((item) => {
      return item.skill.includes(requireInstrument);
    });

    const allUserHTML = filterUser.map((item, index) => {
      return (
        <EachUser key={index}>
          <ProfileImgDiv>
            <ProfileImg src={item.profileImage}></ProfileImg>
            <MemberCard data={item} />
          </ProfileImgDiv>

          <Name>{item.name}</Name>
          <InviteEachButton
            onClick={() => {
              sendInvite(item.uid);
            }}
          >
            邀
          </InviteEachButton>
        </EachUser>
      );
    });
    return allUserHTML;
  };
  useEffect(() => {
    getAllUser().then((data) => {
      setAllUserDate(data);
    });
  }, []);
  useEffect(() => {
    subscribe(setActivityChange, activityDetail.id);
  }, []);
  if (!allUserData) {
    return "isLoading";
  }
  if (!activityChange) {
    return "isLoading";
  }

  return (
    <div>
      <Btn onClick={toggleModal}>邀請</Btn>
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
          {/* <TopBar></TopBar> */}
          <ContentTitle>發送邀請</ContentTitle>
          <CloseIconContainer>
            <CloseIcon src={xIcon} onClick={toggleModal} />
          </CloseIconContainer>

          <AllMemberCol>
            {/* <Title>發送邀請</Title> */}
            <TitleSub>在找哪種樂手?</TitleSub>
            {renderCheckboxField()}

            <MemberField>{renderAllUser()}</MemberField>
            {/* <BtnClose onClick={toggleModal}>+</BtnClose> */}
          </AllMemberCol>
        </Container>
      </StyledModal>
    </div>
  );
}
const Btn = styled.div`
  border: 1px solid #ff0099;
  padding: 6px 8px;
  border-radius: 8px;
  color: #ff0099;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background: #ff0099;
    color: white;
    transform: translateY(-3px);
  }
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #121212;
  color: white;
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
const ContentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  margin: 20px;
  padding: 10px;
  /* border-bottom: 1px solid #979797; */
`;
const AllMemberCol = styled.div`
  position: relative;
  text-align: left;
  /* width: 95%;
  height: 90%; */
  margin: 20px 20px;
  padding: 10px;
`;
const MemberField = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 20px auto;
`;
const Title = styled.div`
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const TitleSub = styled.div`
  /* margin: 10px ; */
`;
const Label = styled.label`
  /* margin-left: 20px; */
  margin-right: 5px;
`;
const RequirementField = styled.div`
  margin: 20px 0;
  height: 30px;
  display: flex;
  justify-content: space-around;
`;
const RequirementDiv = styled.div``;
const EachUser = styled.div`
  width: 100px;
  height: 150px;
  text-align: center;
`;
const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  margin: auto;
`;
const ProfileImgDiv = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin: 0 auto;
`;
const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
`;
const Name = styled.div`
  line-height: 30px;
`;
const InviteEachButton = styled.button`
  border: 1px solid #ff00ff;
  border-radius: 8px;
  padding: 6px 10px;
  margin: 5px 0;
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
  top: -20px;
  right: 0px;
  cursor: pointer;
`;
export default InviteButton;
