import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyleDiv = styled.div`
  width: ${(props) => props.loadingCircleStyle.width};
  min-height: ${(props) => props.loadingCircleStyle.minHeight};

  .MuiCircularProgress-root {
    color: ${(props) => props.loadingCircleStyle.color};
    margin-top: ${(props) => props.loadingCircleStyle.marginTop};
  }
`;
const NormalStyleDiv = styled.div`
  width: 100%;
  min-height: 100vh;

  .MuiCircularProgress-root {
    color: #43e8d8;
    margin-top: 50px;
  }
`;
const ButtonLargeStyleDiv = styled.div`
  .MuiCircularProgress-root {
    color: #000;
    margin-top: 3px;
  }
`;
const ButtonSmallStyleDiv = styled.div`
  .MuiCircularProgress-root {
    color: #000;
    margin-top: 7px;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0px auto",
    // paddingTop: "50px",
    // display: "flex",
    // width: "40px",
    // justifyContent: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function IsLoading(props) {
  const classes = useStyles();

  console.log(props.circleColor);
  console.log(props.loadingCircleStyle);
  if (props.loadingStyle === "normal") {
    return (
      <NormalStyleDiv className={classes.root}>
        <CircularProgress size={40} />
      </NormalStyleDiv>
    );
  } else if (props.loadingStyle === "buttonLarge") {
    return (
      <ButtonLargeStyleDiv className={classes.root}>
        <CircularProgress size={30} />
      </ButtonLargeStyleDiv>
    );
  } else if (props.loadingStyle === "buttonSmall") {
    return (
      <ButtonSmallStyleDiv className={classes.root}>
        <CircularProgress size={30} />
      </ButtonSmallStyleDiv>
    );
  } else {
    return (
      <StyleDiv
        className={classes.root}
        loadingCircleStyle={props.loadingCircleStyle}
      >
        <CircularProgress size={props.loadingCircleStyle.size} />
      </StyleDiv>
    );
  }
}
