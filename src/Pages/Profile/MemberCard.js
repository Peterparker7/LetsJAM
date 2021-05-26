import "../../App.css";
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
  width: 30rem;
  height: 30rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: black;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;
overflow-y: scroll;
`;

function MemberCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

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

  return (
    <div>
      <Btn onClick={toggleModal}></Btn>
      <StyledModal
        isOpen={isOpen}
        afterOpen={afterOpen}
        beforeClose={beforeClose}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
        opacity={opacity}
        backgroundProps={{ opacity }}
      >
        <span>I am a modal!</span>
        <Btn onClick={toggleModal}>close</Btn>
      </StyledModal>
    </div>
  );
}

const Btn = styled.button`
  width: 80px;
  height: 80px;
`;
export default MemberCard;
