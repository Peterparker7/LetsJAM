import "./SelectComponent.css";
import React from "react";
import styled from "styled-components";
import ReactSelect from "react-select";

const options = [
  { value: "所有類型", label: "所有類型" },
  { value: "流行", label: "流行" },
  { value: "嘻哈", label: "嘻哈" },
  { value: "古典", label: "古典" },
];
const optionsCreate = [
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
  .Prefix__control {
    cursor: pointer;
  }
  .Prefix__single-value {
    color: #000;
    margin-left: 0px;
  }
  .Prefix__dropdown-indicator {
    color: #aaa;
  }
  .Prefix__option--is-focused {
    background: #f6f6f6;
    color: black;
  }
  .Prefix__option--is-selected {
    background-color: #43e8d8;
    color: black;
  }
  transition: 0.3s;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 576px) {
    width: 90%;
  }
`;
const ReactSelectComponentWhiteEdit = styled(ReactSelect)`
  text-align: left;
  width: calc(100% - 80px);
  .Prefix__control {
    cursor: pointer;
  }
  .Prefix__single-value {
    color: #000;
  }
  .Prefix__placeholder {
    color: black;
  }
  .Prefix__dropdown-indicator {
    color: #aaa;
  }
  .Prefix__option--is-focused {
    background: #f1f2f3;
    color: black;
  }
  .Prefix__option--is-selected {
    background-color: #43e8d8;
    color: black;
  }
  .Prefix__menu {
    background-color: #f8f8ff;
  }
  .Prefix__option {
    cursor: pointer;
  }
  transition: 0.3s;
`;
const ReactSelectComponentWhiteRegister = styled(ReactSelect)`
  text-align: left;
  width: 250px;
  height: 38px;

  .Prefix__control {
    background-color: #f8f8ff;
    border: 1px solid #b7b7b7;
    border-radius: 0px;
    cursor: pointer;
  }
  .Prefix__single-value {
    color: #2f2f2f;
    margin-left: 0px;
  }
  .Prefix__placeholder {
    color: #b7b7b7;
    margin-left: 0px;
  }
  .Prefix__dropdown-indicator {
    color: #aaa;
  }
  .Prefix__option--is-focused {
    background: #f1f3f5;
    color: black;
  }
  .Prefix__option--is-selected {
    background-color: #43e8d8;
    color: black;
  }
  .Prefix__menu {
    background-color: #f8f8ff;
  }
  @media (max-width: 576px) {
    max-width: 70%;
  }
  @media (max-width: 414px) {
    max-width: 60%;
  }
`;
const ReactSelectComponentBlackEdit = styled(ReactSelect)`
  text-align: left;
  width: calc(100% - 80px);
  .Prefix__control {
    background-color: #121212;
    border-bottom: 1px solid #979797;
    border-radius: 0px;
    cursor: pointer;
  }
  .Prefix__single-value {
    color: #fff;
  }
  .Prefix__value-container {
    padding: 10px;
  }
  .Prefix__placeholder {
    color: white;
    margin-left: 0px;
  }
  .Prefix__dropdown-indicator {
    color: #aaa;
    padding-right: 12px;
  }
  .Prefix__option--is-focused {
    background: #43e8d8;
    color: #121212;
  }
  .Prefix__option--is-selected {
    background-color: #43e8d8;
    color: black;
  }
  .Prefix__menu {
    background-color: #121212;
  }
  transition: 0.3s;
`;

const SelectTypeWhiteHTML = (props) => {
  return (
    <ReactSelectComponentWhite
      options={optionsCreate}
      defaultValue={optionsCreate[0]}
      // placeholder={"類型"}
      className={"ReactSelectClassWhite"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            // borderBottom: "1px solid #fff",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa", // Custom colour
        }),
      }}
      onChange={(value) => {
        props.setType(value.value);
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectTypeWhiteRegisterHTML = (props) => {
  return (
    <ReactSelectComponentWhiteRegister
      options={optionsCreate}
      // defaultValue={optionsCreate[0]}
      placeholder={"請選擇"}
      className={"ReactSelectClassWhite"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            // borderBottom: "1px solid #fff",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa", // Custom colour
        }),
      }}
      onChange={(value) => {
        props.handleChange(value.value, "preferType");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectTypeWhiteEditHTML = (props) => {
  return (
    <ReactSelectComponentWhiteEdit
      options={optionsCreate}
      defaultValue={props.defaultValue}
      placeholder={props.defaultValue}
      className={"ReactSelectClassWhite"}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            // borderBottom: "1px solid #fff",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa", // Custom colour
        }),
      }}
      onChange={(value) => {
        props.handleActivityChange(value.value, "type");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectTypeBlackEditHTML = (props) => {
  return (
    <ReactSelectComponentBlackEdit
      options={optionsCreate}
      defaultValue={props.defaultValue}
      placeholder={props.defaultValue}
      classNamePrefix={"Prefix"}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            // borderBottom: "1px solid #fff",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa", // Custom colour
        }),
      }}
      onChange={(value) => {
        props.handleProfileChange(value.value, "preferType");
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};
const SelectRequireWhiteHTML = (props) => {
  return (
    <ReactSelectComponentWhite
      options={requireOptions}
      isMulti
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
        container: (base) => ({
          ...base,
          display: "inline-block",

          // flex: 1,
          // flexWrap: "no-wrap",
        }),
        multiValue: (base) => ({
          ...base,
          maxWidth: "80px",
        }),
      }}
      onChange={(value) => {
        props.setRequirement(value);
      }}
      components={{
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
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
export { SelectTypeWhiteRegisterHTML };
export { SelectTypeWhiteEditHTML };
export { SelectTypeBlackEditHTML };
export { SelectRequireWhiteHTML };
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
