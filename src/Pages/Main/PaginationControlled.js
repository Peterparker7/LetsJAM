import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function PaginationControlled(props) {
  const classes = useStyles();
  // const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    props.setPage(value);
    console.log(props.page);
  };

  return (
    <div className={classes.root} style={{ margin: "auto" }}>
      {/* <Typography>Page: {props.page}</Typography> */}
      <Pagination
        count={props.count}
        page={props.page}
        onChange={handleChange}
      />
    </div>
  );
}
