import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(AuthContext);
  const { isAuthenticated, isLoading } = state;
  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && !isLoading ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
