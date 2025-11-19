import PropTypes from "prop-types";

/**
 * Based on the usage in Button.jsx, this is a simple wrapper component.
 * Since there is no error parameter passed to it, the FallBackComponent prop is not utilized here.
 *
 * @param {object} props - The properties passed to the Widget component.
 * @param {React.ElementType} [props.FallBackComponent] - A component to render in case of an error (not used here).
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the Widget.
 * @returns {JSX.Element} The rendered Widget component.
 */
const Widget = (props) => {
  return <div className="border border-gray-500">{props.children}</div>;
};

Widget.propTypes = {
  FallBackComponent: PropTypes.elementType,
  children: PropTypes.node,
};

export default Widget;
