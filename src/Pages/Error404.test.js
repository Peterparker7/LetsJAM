import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import Error404 from "./Error404";

describe("Error404", () => {
  it("should render home button", async () => {
    render(<Error404></Error404>);
    const buttonElement = screen.getByTestId("homeButton");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should redirect to home page", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/error404"]}>
        <Switch>
          <Route exact path="/error404">
            <Error404 />
          </Route>
          <Route exact path="/">
            <h1>整個城市都是我的練團室</h1>
          </Route>
        </Switch>
      </MemoryRouter>
    );

    expect(container.innerHTML).toMatch("Page Not Found");

    const buttonElement = screen.getByText("回Let's JAM");
    userEvent.click(buttonElement);

    expect(container.innerHTML).not.toMatch("Page Not Found");
  });
});
