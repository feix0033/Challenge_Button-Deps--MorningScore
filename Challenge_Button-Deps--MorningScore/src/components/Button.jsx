import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  const { children } = props;
  return <div>{children}</div>;
};

Button.propTypes = {};

export default Button;
