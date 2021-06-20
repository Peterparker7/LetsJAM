import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import renderer from "react-test-renderer";
import MemberCard from "./MemberCard";

describe("MemberCard", () => {
  xit("should render correctly", () => {
    const tree = renderer.create(<MemberCard />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
