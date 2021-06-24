import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import styled from "styled-components";

const Newstyled = styled(Pagination)`
  .Mui-selected {
    color: white;
  }
  .MuiButtonBase-root {
    color: white;
  }
  .MuiPaginationItem-page.Mui-selected {
    background-color: black;
  }
`;
const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function PaginationControlled(props) {
  const classes = useStyles();
  const handleChange = (event, value) => {
    props.setPage(value);
  };

  return (
    <div className={classes.root} style={{ margin: "auto" }}>
      <Newstyled
        count={props.count}
        page={props.page}
        onChange={handleChange}
        size={"large"}
      />
    </div>
  );
}
