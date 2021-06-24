import React from "react";
import "jest-styled-components";

import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Register from "./Register";

describe("LoginValidate", () => {
  it("should not over 10 letters", async () => {
    render(<Register></Register>);
    const testString = "11111111111";

    const input = screen.getByTestId("registerInputName");
    userEvent.type(input, testString);
    const buttonElement = screen.getByTestId("registerButton");
    userEvent.click(buttonElement);
    const warningText = screen.getByTestId("nameWarning");
    expect(warningText).toBeInTheDocument();
  });
});
