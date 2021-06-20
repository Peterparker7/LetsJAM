import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import renderer from "react-test-renderer";
import Login from "./Login";

describe("Login", () => {
  render(<Login></Login>);
  it("button should render correctly", () => {
    const button = screen.getByText("登入");
    expect(button).toBeInTheDocument();
  });

  it("button click should action", async () => {
    // const mockFn = jest.fn();
    render(<Login></Login>);

    const buttonElement = screen.getByTestId("loginButton");
    userEvent.click(buttonElement);
    const emailWarning = screen.getByTestId("emailWarning");
    expect(emailWarning).toBeInTheDocument();

    // expect(mockFn).toBeCalledTimes(1);
  });
});
