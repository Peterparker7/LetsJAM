import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import microphoneIcon from "../../images/instrumentIcon/microphone.svg";
import acousticGuitarIcon from "../../images/instrumentIcon/acoustic-Guitar.svg";
import electricGuitarIcon from "../../images/instrumentIcon/Electric-Guitar.svg";

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
      </InstrumentContainer>
    </InstrumentBar>
  );
}

const InstrumentBar = styled.div`
  height: 300px;
  background: #979797;
`;
const InstrumentTitle = styled.div``;
const InstrumentContainer = styled.div`
  display: flex;
`;
const EachInstrument = styled.div``;
const InstrumentIcon = styled.img`
  width: 150px;
`;
const InstrumentName = styled.div``;

export default InstrumentBanner;
