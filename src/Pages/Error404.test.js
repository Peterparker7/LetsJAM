import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import renderer from "react-test-renderer";
import App from "../App";
import Error404 from "./Error404";

describe("Error404", () => {
  render(<Error404></Error404>);
  it("should render home button", async () => {
    // const mockFn = jest.fn();
    const buttonElement = screen.getByTestId("homeButton");
    // buttonElement.onclick = { mockFn };
    expect(buttonElement).toBeInTheDocument();

    // userEvent.click(buttonElement);
    // expect(mockFn).toBeCalledTimes(1);
  });
  it("should render correctly", () => {
    const tree = renderer.create(<Error404 />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
