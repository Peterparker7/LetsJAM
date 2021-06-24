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
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};

const warningDateHTML = (date, status) => {
  let nowDate = new Date();
  if (nowDate >= Date.parse(date) + 16 * 60 * 60000) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        過期了
      </Warning>
    );
  }

  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningTimeHTML = (date, time, status) => {
  let nowDate = Date.now();
  let a = time.split(":");
  let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
  let deviation = 8 * 60 * 60000;

  if (nowDate >= Date.parse(date) + milliseconds - deviation) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        過期了
      </Warning>
    );
  }

  if (!status && !time) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningTypeHTML = (type, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningRequirementHTML = (requirement, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningLimitHTML = (limit, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningLevelHTML = (level, status) => {
  if (level.length > 20) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        字數太多了
      </Warning>
    );
  }
};
const warningLocationHTML = (location, status, setPlaceStatus) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
  if (location.length > 30) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        字數上限為30字
      </Warning>
    );
  }
};
const warningImageHTML = (image, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};

const Warning = styled.div`
  width: auto;
  font-size: 12px;
  padding-left: 10px;
  position: absolute;
  left: 80px;
  bottom: -25px;
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
