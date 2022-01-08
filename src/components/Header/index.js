import React from "react";
import { Link } from "react-router-dom";
import classes from "./style.module.css";
function Header() {
  return (
    <nav className={classes.header}>
      <div>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}

export default Header;
