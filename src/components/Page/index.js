import React from "react";
import classes from "./style.module.css";
function Page({ children }) {
  return <div className={classes.page}>{children}</div>;
}

export default Page;
