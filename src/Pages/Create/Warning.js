import styled from "styled-components";
import React from "react";

const warningTitleHTML = (title, status) => {
  if (title.length > 10) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        活動名稱最多10個字
      </Warning>
    );
  } else if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};

const warningDateHTML = (date, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningTimeHTML = (time, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningTypeHTML = (type, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningRequirementHTML = (requirement, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningLimitHTML = (limit, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningLevelHTML = (level, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningLocationHTML = (location, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};
const warningImageHTML = (image, status) => {
  if (!status) {
    console.log("warnIMage");

    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        此項必填
      </Warning>
    );
  }
};

const Warning = styled.div`
  width: 60px;
  font-size: 12px;
  padding-left: 10px;
`;

export { warningTitleHTML };
export { warningDateHTML };
export { warningTimeHTML };
export { warningTypeHTML };
export { warningRequirementHTML };
export { warningLimitHTML };
export { warningLevelHTML };
export { warningLocationHTML };
export { warningImageHTML };