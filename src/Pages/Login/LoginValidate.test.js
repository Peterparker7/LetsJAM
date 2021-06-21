import React from "react";
import styled from "styled-components";
import "jest-styled-components";

import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { warningNameHTML } from "./LoginValidate";
import Register from "./Register";

const Warning = styled.div`
  width: auto;
  font-size: 12px;
  padding-left: 10px;
  position: absolute;
  left: 75px;
  bottom: -15px;
`;

describe("LoginValidate", () => {
  it("should not over 10 letters", async () => {
    render(<Register></Register>);
    const testString = "11111111111";

    const func = warningNameHTML(testString, true);
    // console.log(func);
    // expect(func).toEqual(
    //   <Warning style={{ color: "red", display: "inline-block" }}>
    //     名稱最多10字
    //   </Warning>
    // );
    const input = screen.getByTestId("registerInputName");
    userEvent.type(input, testString);
    const buttonElement = screen.getByTestId("registerButton");
    userEvent.click(buttonElement);
    const warningText = screen.getByTestId("nameWarning");
    expect(warningText).toBeInTheDocument();
  });
});
