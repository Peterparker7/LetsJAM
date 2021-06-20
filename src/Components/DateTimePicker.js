import "./DateTimePicker.css";
import "date-fns";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const StylePickersTime = styled(KeyboardTimePicker)`
  width: 220px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
const StylePickersDate = styled(KeyboardDatePicker)`
  width: 220px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
const StylePickersTimeActivity = styled(KeyboardTimePicker)`
  width: calc(100% - 80px);
  height: 40px;
  justify-content: center;
`;
const StylePickersDateActivity = styled(KeyboardDatePicker)`
  width: calc(100% - 80px);
  height: 40px;
  justify-content: center;
`;

function MaterialUIPickersTime(props) {
  const [selectedDate, setSelectedDate] = useState();

  function addDays(date, days) {
    if (days === 0) {
      let result = new Date(date);
      result.setDate(result.getDate() + 7);
      return result;
    }
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  let nowDate = new Date();
  let sat = addDays(nowDate, 6 - nowDate.getDay())
    .toISOString()
    .substr(0, 10);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    let timeFormat = date.toString().slice(16, 21);

    props.handleChange(timeFormat, "time");
  };

  useEffect(() => {
    setSelectedDate(new Date(`${sat}T16:00`));
  }, [sat]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StylePickersTime
        className={"customStyle"}
        // margin="normal"
        id="time-picker"
        // label="時間"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change time",
        }}
        data-testid="pickerTime"
      />
    </MuiPickersUtilsProvider>
  );
}

function MaterialUIPickersDate(props) {
  const [selectedDate, setSelectedDate] = useState();

  function addDays(date, days) {
    if (days === 0) {
      let result = new Date(date);
      result.setDate(result.getDate() + 7);
      return result;
    }
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  let nowDate = new Date();

  let satOri = addDays(nowDate, 6 - nowDate.getDay()).toString();

  const handleDateChange = (date) => {
    setSelectedDate(date);

    let dateFormat = date.toISOString().slice(0, 10);

    props.handleChange(dateFormat, "date");
  };
  useEffect(() => {
    setSelectedDate(new Date(`${satOri}`));
  }, [satOri]);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StylePickersDate
        className={"customDateStyle"}
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        // margin="normal"
        id="date-picker-inline"
        // label="日期"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
        data-testid="pickerDate"
      />
    </MuiPickersUtilsProvider>
  );
}
function MaterialUIPickersDateActivity(props) {
  const [selectedDate, setSelectedDate] = useState();

  const handleDateChange = (date) => {
    setSelectedDate(date);

    let dateFormat = date.toISOString().slice(0, 10);
    props.handleActivityChange(dateFormat, "date");
  };
  useEffect(() => {
    setSelectedDate(new Date(`${props.defaultValue}T08:00`));
  }, [props.defaultValue]);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StylePickersDateActivity
        className={"customDateStyleActivity"}
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        // margin="normal"
        id="date-picker-inline"
        // label="日期"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
function MaterialUIPickersTimeActivity(props) {
  const [selectedDate, setSelectedDate] = useState();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    let timeFormat = date.toString().slice(16, 21);
    props.handleActivityChange(timeFormat, "time");
  };
  useEffect(() => {
    setSelectedDate(new Date(`${props.defaultDate}T${props.defaultValue}`));
  }, [props.defaultDate, props.defaultValue]);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StylePickersTimeActivity
        className={"customTimeStyleActivity"}
        id="date-picker-inline"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export { MaterialUIPickersTime };
export { MaterialUIPickersDate };
export { MaterialUIPickersTimeActivity };
export { MaterialUIPickersDateActivity };
