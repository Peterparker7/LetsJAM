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
  width: 25rem;
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

function MemberCard(props) {
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

  const handleYoutube = () => {
    if (props.data.youtubeUrl) {
      const videoUrl = props.data.youtubeUrl;
      const source = videoUrl.toString().slice(-11);
      const videoEmbedUrl = `https://www.youtube.com/embed/${source}?&autoplay=1&mute=1&loop=0&controls=1&rel=0" frameborder="1" allowfullscreen>`;
      return (
        <iframe
          width="100%"
          height="300px"
          src={videoEmbedUrl}
          title="YouTube video player"
        ></iframe>
      );
    } else {
      return;
    }
  };

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
        <Container>
          <BackBar>
            <BackImg src={props.data.profileImage}></BackImg>
          </BackBar>
          <ProfileImageField>
            <ProfileImg src={props.data.profileImage}></ProfileImg>
          </ProfileImageField>
          <Name>{props.data.name}</Name>
          <IntroTitle>介紹</IntroTitle>
          <Intro>{props.data.intro}</Intro>
          <PreferType>偏好類型：{props.data.preferType}</PreferType>
          <Skill>樂器技能：{props.data.skill}</Skill>
          <VideoTitle>練習</VideoTitle>
          <YoutubeUrl>{handleYoutube()}</YoutubeUrl>
        </Container>
        <Btn onClick={toggleModal}>close</Btn>
      </StyledModal>
    </div>
  );
}
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
`;
const BackBar = styled.div`
  width: 100%;
  height: 160px;
  align-items: flex-start;
  background-color: grey;
  position: relative;
`;
const BackImg = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
`;
const ProfileImageField = styled.div`
  position: absolute;
  width: 205px;
  height: 205px;
  border: 5px solid #fffc;

  top: 50px;
`;
const ProfileImg = styled.img`
  width: 195px;
  height: 195px;
  object-fit: cover;
  position: relative;
`;
const Name = styled.div`
  margin: 0 50px;
  font-size: 28px;
  text-align: right;
  height: 120px;
  display: grid;
  align-items: center;
`;
const IntroTitle = styled.div`
  text-align: left;
  margin: 10px auto 10px 20px;
  font-size: 24px;
`;
const Intro = styled.div`
  /* width: 100%; */
  text-align: left;
  padding: 10px 50px;
  padding-bottom: 20px;
`;
const PreferType = styled.div`
  margin: 10px 40px;

  text-align: left;
  padding-bottom: 10px;
`;
const Skill = styled.div`
  margin: 0px 40px;
  text-align: left;
  height: 40px;
`;
const VideoTitle = styled.div`
  text-align: left;
  margin: 10px 20px 10px 20px;
  font-size: 24px;
  padding-bottom: 10px;
  border-bottom: 1px solid #979797;
`;
const YoutubeUrl = styled.div`
  width: 90%;
  margin: 0 auto;
  padding-bottom: 30px;
`;
const Btn = styled.button`
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  position: absolute;
`;
export default MemberCard;
