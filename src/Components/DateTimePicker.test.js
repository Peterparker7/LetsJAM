import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import renderer from "react-test-renderer";
import DateTimePicker from "./DateTimePicker";
import { MaterialUIPickersTime } from "./DateTimePicker";
import { MaterialUIPickersDate } from "./DateTimePicker";

describe("should show correct date time", () => {
  //   it("should show correct date", () => {
  //     render(<MaterialUIPickersDate></MaterialUIPickersDate>);
  //     let nowDate = new Date();
  //     const datePicker = screen.getByTestId("datePicker");
  //     expect(datePicker).toHaveDisplayValue().toBe()
  //   });
  it("should show correct time", async () => {
    const { getByTestId } = render(<MaterialUIPickersTime />);
    const timePicker = getByTestId("pickerTime");
    // expect(timePicker.Value.slice(-1, -6)).toEqual("16:00");
    console.log(timePicker.textContent);
    expect(timePicker).toBeInTheDocument();
  });
});
