import "./DateTimePicker.css";
import "date-fns";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { parseISO } from "date-fns";

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

function MaterialUIPickersTime(props) {
  // The first commit of Material-UI

  console.log(props.datesat);
  console.log(props.time);
  const [selectedDate, setSelectedDate] = useState();
  //   const [selectedDate, setSelectedDate] = React.useState(
  //     new Date(`${props.datesat}T${props.time}`
  //     )
  //   );

  // new Date("2014-08-18T21:11:54")
  console.log(selectedDate);

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
    console.log(props.datesat);
    console.log(props.time);
    setSelectedDate(date);
    console.log(date);
    let timeFormat = date.toString().slice(16, 21);

    // let timeFormat = `${date.getHours()}:${date.getMinutes()}`;
    console.log(timeFormat);
    props.handleChange(timeFormat, "time");
  };

  useEffect(() => {
    setSelectedDate(new Date(`${sat}T16:00`));
  }, []);

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

  let sat = addDays(nowDate, 6 - nowDate.getDay())
    .toString()
    .substr(0, 10);
  let satOri = addDays(nowDate, 6 - nowDate.getDay()).toString();

  const handleDateChange = (date) => {
    setSelectedDate(date);

    let dateFormat = date.toISOString().slice(0, 10);

    props.handleChange(dateFormat, "date");
  };
  useEffect(() => {
    setSelectedDate(new Date(`${satOri}`));
  }, []);
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
      />
    </MuiPickersUtilsProvider>
  );
}

export { MaterialUIPickersTime };
export { MaterialUIPickersDate };
// export default function MaterialUIPickers() {
//   // The first commit of Material-UI
//   const [selectedDate, setSelectedDate] = React
//     .useState
//     // new Date("2014-08-18T21:11:54")
//     ();

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <MuiPickersUtilsProvider utils={DateFnsUtils}>
//       <Grid container justify="space-around">
//         <KeyboardDatePicker
//           disableToolbar
//           variant="inline"
//           format="MM/dd/yyyy"
//           margin="normal"
//           id="date-picker-inline"
//           label="Date picker inline"
//           value={selectedDate}
//           onChange={handleDateChange}
//           KeyboardButtonProps={{
//             "aria-label": "change date",
//           }}
//         />
//         <KeyboardDatePicker
//           margin="normal"
//           id="date-picker-dialog"
//           label="Date picker dialog"
//           format="MM/dd/yyyy"
//           value={selectedDate}
//           onChange={handleDateChange}
//           KeyboardButtonProps={{
//             "aria-label": "change date",
//           }}
//         />
//         <KeyboardTimePicker
//           margin="normal"
//           id="time-picker"
//           label="Time picker"
//           value={selectedDate}
//           onChange={handleDateChange}
//           KeyboardButtonProps={{
//             "aria-label": "change time",
//           }}
//         />
//       </Grid>
//     </MuiPickersUtilsProvider>
//   );
// }
