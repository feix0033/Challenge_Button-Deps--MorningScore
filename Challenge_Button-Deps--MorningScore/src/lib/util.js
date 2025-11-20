/* twClassNames
This utility funciton is not included in the source code. And it not inlcuded in the challenage.
So, auto generates by Github Copilot.
 */
export const twClassNames = (...args) => {
  let className = "";
  args.forEach((arg) => {
    if (typeof arg === "string") {
      className += ` ${arg}`;
    } else if (Array.isArray(arg)) {
      className += ` ${twClassNames(...arg)}`;
    } else if (typeof arg === "object" && arg !== null) {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) {
          className += ` ${key}`;
        }
      });
    }
  });
  return className;
};

/* textSizeMap
The text size map is staric style object that do not re-render in the React component.
Therefore, move it into util.js to avoid re-creating the object on each render.
*/
export const textSizeMap = {
  large: "",
  default: "text-sm",
  small: "text-smedium",
  xsmall: "text-xs",
  xxsmall: "text-xs",
  custom: "",
};
