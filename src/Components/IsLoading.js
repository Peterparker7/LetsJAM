import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledDiv = styled.div`
  ${(props) => {
    if (props.loadingStyle === "normal") {
      return normal;
    } else if (props.loadingStyle === "buttonLarge") {
      return buttonLarge;
    } else if (props.loadingStyle === "buttonSmall") {
      return buttonSmall;
    } else {
      return normal;
    }
  }}
`;
const normal = `
  width: 100%;
  min-height: 100vh;

  .MuiCircularProgress-root {
    color: #43e8d8;
    margin-top: 50px;
  }
`;
const buttonLarge = `
  .MuiCircularProgress-root {
    color: #000;
    margin-top: 3px;
  }
`;
const buttonSmall = `
  .MuiCircularProgress-root {
    color: #000;
    margin-top: 7px;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0px auto",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function IsLoading(props) {
  const classes = useStyles();

  return (
    <StyledDiv className={classes.root} loadingStyle={props.loadingStyle}>
      <CircularProgress size={props.size} />
    </StyledDiv>
  );
}
