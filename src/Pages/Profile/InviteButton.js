import Modal from "styled-react-modal";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  getSpecificData,
  deleteActivityData,
  updateActivitiesData,
  getAllUser,
  sendUserInvite,
} from "../../utils/firebase";

const StyledModal = Modal.styled`
  width: 40rem;
  height: 40rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
overflow-y: scroll;
`;

function InviteButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const [allUserData, setAllUserDate] = useState();
  const [requireInstrument, setRequireInstrument] = useState();
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
        <label for="vocal">Vocal</label>
        <input
          id="vocal"
          type="radio"
          name={"requireInstrument"}
          value={"Vocal"}
          onChange={(e) => {
            handleRequirement(e.target.value);
          }}
        />
        <label for="guitar">吉他</label>
        <input
          id="guitar"
          type="radio"
          name={"requireInstrument"}
          value={"吉他"}
          onChange={(e) => {
            handleRequirement(e.target.value);
          }}
        />
        <label for="bass">Bass</label>
        <input
          id="bass"
          type="radio"
          name={"requireInstrument"}
          value={"bass"}
          onChange={(e) => {
            handleRequirement(e.target.value);
          }}
        />
        <label for="piano">Piano</label>
        <input
          id="piano"
          type="radio"
          name={"requireInstrument"}
          value={"piano"}
          onChange={(e) => {
            handleRequirement(e.target.value);
          }}
        />
        <label for="drum">木箱鼓</label>
        <input
          id="drum"
          type="radio"
          name={"requireInstrument"}
          value={"木箱鼓"}
          onChange={(e) => {
            handleRequirement(e.target.value);
          }}
        />
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
  console.log(activityDetail.id);
  console.log(allUserData);
  const renderAllUser = () => {
    const filterUser = allUserData.filter((item) => {
      return item.skill.includes(requireInstrument);
    });
    console.log(filterUser);

    const allUserHTML = filterUser.map((item, index) => {
      return (
        <div key={index}>
          <ProfileImage></ProfileImage>
          <Name>{item.name}</Name>
          <InviteEachButton
            onClick={() => {
              sendInvite(item.uid);
            }}
          >
            邀
          </InviteEachButton>
        </div>
      );
    });
    return allUserHTML;
  };
  useEffect(() => {
    getAllUser().then((data) => {
      setAllUserDate(data);
    });
  }, []);
  if (!allUserData) {
    return "isLoading";
  }

  return (
    <div>
      <button onClick={toggleModal}>邀請</button>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <AllMemberCol>
          <Title>發送邀請</Title>
          <div>在找哪種樂手?</div>
          {renderCheckboxField()}

          <MemberField>{renderAllUser()}</MemberField>
          <BtnClose onClick={toggleModal}>+</BtnClose>
        </AllMemberCol>
      </StyledModal>
    </div>
  );
}

const AllMemberCol = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
`;
const MemberField = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Title = styled.div`
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const RequirementField = styled.div``;
const ProfileImage = styled.div``;
const Name = styled.div``;
const InviteEachButton = styled.button``;
const BtnClose = styled.button`
  transform: rotate(0.125turn);
  font-size: 28px;
  position: absolute;
  top: -10px;
  right: -30px;
  cursor: pointer;
`;
export default InviteButton;
