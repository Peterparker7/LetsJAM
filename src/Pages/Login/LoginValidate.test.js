import React from "react";
import styled from "styled-components";
import "jest-styled-components";

import "@testing-library/jest-dom/extend-expect";
import { warningNameHTML } from "./LoginValidate";

const Warning = styled.div`
  width: auto;
  font-size: 12px;
  padding-left: 10px;
  position: absolute;
  left: 75px;
  bottom: -15px;
`;

describe("LoginValidate", () => {
  xit("should not over 10 letters", async () => {
    const testString = "11111111111";
    const func = warningNameHTML(testString, true);
    // console.log(func);
    expect(func).toEqual(
      <Warning style={{ color: "red", display: "inline-block" }}>
        名稱最多10字
      </Warning>
    );
  });
});
