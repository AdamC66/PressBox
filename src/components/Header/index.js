import React, { useContext } from "react";
import { Navbar, Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { AuthContext } from "context/AuthContext";

function Header() {
  const {
    state: { isAuthenticated },
    logout,
  } = useContext(AuthContext);

  return (
    <Navbar>
      <Navbar.Group align="left">
        <Navbar.Heading>Gandalf</Navbar.Heading>
        <Navbar.Group />
        <Link to="/">
          <Button className="bp3-minimal" icon="home" text="Home" />
        </Link>
        <Link to="/about">
          <Button className="bp3-minimal" icon="help" text="About" />
        </Link>
      </Navbar.Group>
      <Navbar.Group align="right">
        <Navbar.Divider />
        {isAuthenticated ? (
          <Button
            className="bp3-minimal"
            icon="user"
            onClick={() => logout()}
            text="Logout"
          />
        ) : (
          <Link to="/login">
            <Button className="bp3-minimal" icon="user" text="Login" />
          </Link>
        )}
      </Navbar.Group>
    </Navbar>
  );
}

export default Header;
