import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyleProgress = styled(CircularProgress)`
  .MuiCircularProgress-root {
    color: black;
  }
`;
const StyleDiv = styled.div`
  .MuiCircularProgress-root {
    color: black;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "7px auto",
    display: "flex",
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
      <StyleProgress size={30} />
    </StyleDiv>
  );
}
