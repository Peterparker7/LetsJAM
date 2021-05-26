import Modal from "styled-react-modal";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  getSpecificData,
  deleteActivityData,
  updateActivitiesData,
  getAllUser,
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

function InviteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

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

  useEffect(() => {
    getAllUser().then((data) => {
      console.log(data);
    });
  }, []);

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
const Title = styled.div`
  padding: 10px;
  border-bottom: 1px solid #979797;
`;
const BtnClose = styled.button`
  transform: rotate(0.125turn);
  font-size: 28px;
  position: absolute;
  top: -10px;
  right: -30px;
  cursor: pointer;
`;
export default InviteButton;
