import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { MaterialUIPickersTime } from "./DateTimePicker";

describe("should show correct date time", () => {
  xit("should show correct time", async () => {
    // const { getByTestId } = render(<MaterialUIPickersTime />);
    // const timePicker = getByTestId("pickerTime");
    render(<MaterialUIPickersTime />);
    const timePicker = screen.getByTestId("pickerTime");
    // expect(timePicker.Value.slice(-1, -6)).toEqual("16:00");
    expect(timePicker).toBeInTheDocument();
  });
});
