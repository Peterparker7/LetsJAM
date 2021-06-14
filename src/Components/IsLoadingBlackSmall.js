import React from "react";
import styled from "styled-components";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyleProgress = styled(CircularProgress)`
  .MuiCircularProgress-root {
    color: black;
  }
`;
const StyleDiv = styled.div`
  /* margin: 10px auto; */
  .MuiCircularProgress-root {
    color: black;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "absolute",
    // top: "-40px",
    // right: "40%",
    margin: "7px auto",
    display: "flex",
    // width: "40px",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function IsLoading(props) {
  const classes = useStyles();

  return (
    <StyleDiv className={classes.root}>
      {/* <CircularProgress size={30} /> */}
      <StyleProgress size={30} />
    </StyleDiv>
  );
}