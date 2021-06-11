import "./SelectComponent.css";
import React from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import ReactSelect, { NonceProvider } from "react-select";

const options = [
  { value: "所有類型", label: "所有類型" },
  { value: "流行", label: "流行" },
  { value: "嘻哈", label: "嘻哈" },
  { value: "古典", label: "古典" },
];
const requireOptions = [
  { value: "所有樂器", label: "所有樂器" },
  { value: "Vocal", label: "Vocal" },
  { value: "吉他", label: "吉他" },
  { value: "木箱鼓", label: "木箱鼓" },
  { value: "電吉他", label: "電吉他" },
  { value: "貝斯", label: "貝斯" },
  { value: "鍵盤", label: "鍵盤" },
  { value: "爵士鼓", label: "爵士鼓" },
];
const ReactSelectComponent = styled(ReactSelect)`
  width: 150px;
  margin-left: 20px;
  background: "#121212";
  @media (max-width: 576px) {
  }
  @media (max-width: 414px) {
    margin-left: 10px;
    width: 130px;
  }
`;
const ReactSelectComponentWhite = styled(ReactSelect)`
  width: 220px;

  @media (max-width: 576px) {
  }
  @media (max-width: 414px) {
    margin-left: 10px;
    width: 130px;
  }
`;

const SelectTypeWhiteHTML = (props) => {
  return (
    <ReactSelectComponentWhite
      options={options}
      defaultValue={options[0]}
      // placeholder={"類型"}
      className={"ReactSelectClassWhite"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            borderBottom: "1px solid #fff",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa", // Custom colour
        }),
      }}
      onChange={(value) => {
        props.setType(value);
        props.handleFilter(value.value, "type");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectTypeHTML = (props) => {
  return (
    <ReactSelectComponent
      options={options}
      defaultValue={options[0]}
      // placeholder={"類型"}
      className={"ReactSelectClass"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          boxShadow: "none",
          "&:hover": {
            border: "1px solid #fff",
          },
        }),
      }}
      onChange={(value) => {
        props.setType(value.value);
        props.handleFilter(value.value, "type");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectRequireHTML = (props) => {
  return (
    <ReactSelectComponent
      options={requireOptions}
      defaultValue={requireOptions[0]}
      // placeholder={"需求"}
      className={"ReactSelectClass"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          boxShadow: "none",
          "&:hover": {
            border: "1px solid #fff",
          },
        }),
      }}
      onChange={(value) => {
        props.setRequire(value.value);
        props.handleFilter(value.value, "requirement");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export { SelectTypeWhiteHTML };
export { SelectTypeHTML };
export { SelectRequireHTML };

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

// export default function SimpleSelect(props) {
//   const classes = useStyles();
//   const [type, setType] = React.useState("");

//   const handleChange = (event) => {
//     setType(event.target.value);
//   };

//   return (
//     <div>
//       <FormControl className={classes.formControl}>
//         <InputLabel id="demo-simple-select-label">類型</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={type}
//           onChange={handleChange}
//         >
//           <MenuItem value={"流行"}>流行</MenuItem>
//           <MenuItem value={"嘻哈"}>嘻哈</MenuItem>
//           <MenuItem value={"古典"}>古典</MenuItem>
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
