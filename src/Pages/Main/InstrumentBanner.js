import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import React from "react";
import microphoneIcon from "../../images/instrumentIcon/microphone.svg";
import acousticGuitarIcon from "../../images/instrumentIcon/acoustic-Guitar.svg";
import electricGuitarIcon from "../../images/instrumentIcon/Electric-Guitar.svg";
import bassGuitarIcon from "../../images/instrumentIcon/bass-guitar.svg";
import keyboardIcon from "../../images/instrumentIcon/keyboard.svg";
import cajonIcon from "../../images/instrumentIcon/Cajon-drum.svg";
import drumIcon from "../../images/instrumentIcon/drum-set.svg";

function InstrumentBanner() {
  return (
    <InstrumentBar>
      <InstrumentTitle>想以哪種樂手身份參加？</InstrumentTitle>
      <InstrumentContainer>
        <EachInstrument>
          <InstrumentIcon
            style={{ width: "50px" }}
            src={microphoneIcon}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon
            style={{ transform: "rotate(0.03turn)" }}
            src={acousticGuitarIcon}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon src={electricGuitarIcon}></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon
            src={bassGuitarIcon}
            style={{ transform: "rotate(0.25turn)" }}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon
            style={{ transform: "rotate(0.88turn)", width: "100px" }}
            src={keyboardIcon}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon
            style={{ transform: "rotate(1turn)", width: "100px" }}
            src={cajonIcon}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
        <EachInstrument>
          <InstrumentIcon
            style={{ transform: "rotate(1turn)", width: "100px" }}
            src={drumIcon}
          ></InstrumentIcon>
          <InstrumentName></InstrumentName>
        </EachInstrument>
      </InstrumentContainer>
    </InstrumentBar>
  );
}

const InstrumentBar = styled.div`
  height: 300px;
  background: #43e8d8;
`;
const InstrumentTitle = styled.div``;
const InstrumentContainer = styled.div`
  display: flex;
`;
const EachInstrument = styled.div`
  &:hover {
    transform: translateY(-3px);
  }
`;
const InstrumentIcon = styled.img`
  width: 150px;
`;
const InstrumentName = styled.div``;

export default InstrumentBanner;
