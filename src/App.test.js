import { render, screen, fireEvent } from "@testing-library/react";

import renderer from "react-test-renderer";
import App from "./App";

//
jest.mock("./firebase", () => {
  return {
    getUser: () => {
      return new Promise((resolve) => {
        const user = { name: "Max" };
        resolve(user);
      });
    },
  };
});

test("should", async () => {
  render(<App />);
  const linkElement = await screen.findByText(/learn react/i); //字串也行
  expect(linkElement).toBeInTheDocument();
});

test("1+1=2", () => {
  const result = 1 + 1;
  const expected = 2;
  expect(result).toEqual(expected);
});

//component 基本測試
test("should render text from props", () => {
  render(<Button text="123" />);
});

it("should show correct button when click button", async () => {
  render(<App />);
  const buttonElement = await screen.findRole("button", {
    name: /click me/i,
  });
  const pElement = await screen.findByText(/number: 0/i);
  expect(pElement).toBeInTheDocument();
});
