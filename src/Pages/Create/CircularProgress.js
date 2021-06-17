import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyleDiv = styled.div`
  .MuiCircularProgress-root {
    color: black;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "absolute",
    margin: "0 auto",
    display: "flex",
    width: "40px",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function CircularIndeterminate(props) {
  const classes = useStyles();

  return (
    <StyleDiv className={classes.root}>
      <CircularProgress size={30} />
      {/* <StyleProgress /> */}
    </StyleDiv>
  );
}
