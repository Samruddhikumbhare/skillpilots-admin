import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const PrivateRoute = ({ Component }) => {
  const token = localStorage.getItem("skillpilotAdminToken"); // Replace with your token logic

  return token ? Component : <Navigate to="/login" replace />;
};
PrivateRoute.propTypes = {
  Component: PropTypes.elementType.isRequired, // Validate that `Component` is a React component
};
export default PrivateRoute;
