import "../App.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import iconTaylorWhite from "../images/icon-Taylor-white.png";

function Footer() {
  return (
    <FooterDiv>
      <Item>
        <LogoImg src={iconTaylorWhite} />
      </Item>
      <Item>
        <NavTitle>HELPFUL LINKS</NavTitle>
        <Nav>About</Nav>
        <Nav>Media</Nav>
        <Nav>Contact Me</Nav>
      </Item>
    </FooterDiv>
  );
}

const FooterDiv = styled.div`
  display: flex;
  background-color: black;
  height: 180px;
  padding: 0 40px;
  align-items: center;
`;

const Item = styled.div`
  align-items: center;
  color: white;
  /* margin-top: 40px;
  margin-left: 40px; */
  @media (max-width: 576px) {
  }
`;
const LogoImg = styled.img`
  width: 320px;
  @media (max-width: 576px) {
    width: 200px;
  }
`;
const NavTitle = styled.div`
  font-size: 10px;
  margin-bottom: 10px;
  color: #979797;
`;
const Nav = styled.div`
  text-align: left;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
`;
export default Footer;
