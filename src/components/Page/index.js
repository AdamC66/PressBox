import React from "react";
import clsx from "clsx";
import classes from "./style.module.css";
function Page({ children, className }) {
  return <div className={clsx(classes.page, className)}>{children}</div>;
}

export default Page;
