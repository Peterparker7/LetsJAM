import "../../App.css";
import Modal from "styled-react-modal";
import styled from "styled-components";
import React, { useState } from "react";

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
border-radius: 4px;
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

  const skillArrange = () => {
    let skillArray = props.data.skill;
    let skillArrayDelimiter = skillArray.join(`, `);
    return skillArrayDelimiter;
  };

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
          <Skill>樂器技能：{skillArrange()}</Skill>
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
  /* @media (max-width: 414px) {
    width: 90%;
  } */
`;
const ProfileImg = styled.img`
  width: 195px;
  height: 195px;
  object-fit: cover;
  position: relative;
`;
const Name = styled.div`
  margin: 30px 10px 40px 215px;
  font-size: 28px;
  font-weight: 600;
  /* text-align: right; */
  /* height: 120px; */

  display: grid;
  align-items: center;
  padding: 10px;
  text-shadow: 0 0 5px rgba(67, 232, 216, 1), 0 0 10px rgba(67, 232, 216, 1),
    0 0 20px rgba(67, 232, 216, 1), 0 0 40px rgba(67, 232, 216, 1);
`;
const IntroTitle = styled.div`
  text-align: left;
  margin: 20px 30px 20px 30px;
  font-size: 24px;
  font-weight: 600;
`;
const Intro = styled.div`
  /* width: 100%; */
  text-align: left;
  padding: 10px 0px;
  padding-bottom: 20px;
  margin: 0px 30px;

  letter-spacing: 1px;
  line-height: 24px;
`;
const PreferType = styled.div`
  margin: 10px 30px;

  text-align: left;
  padding-bottom: 10px;
`;
const Skill = styled.div`
  margin: 0px 30px;
  text-align: left;
  height: 40px;
`;
const VideoTitle = styled.div`
  text-align: left;
  margin: 30px 30px 10px 30px;
  font-size: 24px;
  font-weight: 600;
  padding-bottom: 10px;
  /* border-bottom: 1px solid #979797; */
`;
const YoutubeUrl = styled.div`
  /* width: 90%; */
  margin: 0 30px;
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
