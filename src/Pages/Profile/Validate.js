import styled from "styled-components";
import React from "react";

const warningTitleHTML = (title, initValue, setStatus) => {
  console.log(
    "🚀 ~ file: Validate.js ~ line 5 ~ warningTitleHTML ~ initValue",
    initValue
  );
  console.log(
    "🚀 ~ file: Validate.js ~ line 5 ~ warningTitleHTML ~ title",
    title
  );

  if (title.length > 10) {
    console.log("!!");
    // setStatus(false);
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        活動名稱最多10個字
      </Warning>
    );
  } else if (title.length === 0) {
    // setStatus(false);

    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};

const warningDateHTML = (date, initValue, setStatus) => {
  let nowDate = new Date();
  if (nowDate >= Date.parse(date) + 16 * 60 * 60000) {
    // setStatus(false);

    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        過期了
      </Warning>
    );
  } else {
    // setStatus(true);
  }

  //   if (!status) {
  //     return (
  //       <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
  //     );
  //   }
};
const warningTimeHTML = (date, time, setStatus) => {
  console.log(
    "🚀 ~ file: Validate.js ~ line 45 ~ warningTimeHTML ~ time",
    time
  );
  let nowDate = Date.now();
  let a = time.split(":");
  let milliseconds = a[0] * 60 * 60000 + a[1] * 60000;
  let deviation = 8 * 60 * 60000;

  if (nowDate >= Date.parse(date) + milliseconds - deviation) {
    // setStatus(false);

    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        過期了
      </Warning>
    );
  } else {
    // setStatus(true);
  }

  //   if (!status && !time) {
  //     return (
  //       <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
  //     );
  //   }
};
const warningTypeHTML = (type, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningRequirementHTML = (requirement, status) => {
  if (requirement.length === 0) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
  //   if (!status) {
  //     return (
  //       <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
  //     );
  //   }
};
const warningLimitHTML = (limit, status) => {
  if (!status) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};
const warningLevelHTML = (level, status) => {
  console.log(
    "🚀 ~ file: Validate.js ~ line 106 ~ warningLevelHTML ~ level",
    level
  );
  if (level.length > 20) {
    return (
      <Warning style={{ display: "inline-block", color: "red" }}>
        字數上限20字
      </Warning>
    );
  }
  // if (!status) {
  //   return (
  //     <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
  //   );
  // }
};
const warningLocationHTML = (location, status, setPlaceStatus) => {
  console.log(
    "🚀 ~ file: Validate.js ~ line 109 ~ warningLocationHTML ~ location",
    location
  );
  if (location.length === 0) {
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
    console.log("warnIMage");

    return (
      <Warning style={{ display: "inline-block", color: "red" }}>必填</Warning>
    );
  }
};

const warningProfileNameHTML = (name) => {
  if (name.length === 0) {
    return (
      <WarningNeon style={{ display: "inline-block", color: "white" }}>
        必填
      </WarningNeon>
    );
  }
  if (name.length > 10) {
    return (
      <WarningNeon style={{ display: "inline-block", color: "white" }}>
        名稱最多10字
      </WarningNeon>
    );
  }
};
const warningProfileSkillHTML = (skill) => {
  if (skill.length === 0) {
    return (
      <WarningNeon style={{ display: "inline-block", color: "white" }}>
        請至少選一項樂器
      </WarningNeon>
    );
  }
};
const warningProfileIntroHTML = (intro) => {
  if (intro.length > 250) {
    return (
      <WarningNeon style={{ display: "inline-block", color: "white" }}>
        字數上限250字
      </WarningNeon>
    );
  }
};
const Warning = styled.div`
  width: auto;
  font-size: 12px;
  padding-left: 10px;
  position: absolute;
  left: 75px;
  bottom: -15px;
`;

const WarningNeon = styled.div`
  width: auto;
  font-size: 14px;
  padding-left: 10px;
  position: absolute;
  left: 75px;
  bottom: -15px;
  color: white;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
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
export { warningProfileNameHTML };
export { warningProfileSkillHTML };
export { warningProfileIntroHTML };
