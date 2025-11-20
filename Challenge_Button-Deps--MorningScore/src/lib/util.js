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

export const textSizeMap = {
  large: "",
  default: "text-sm",
  small: "text-smedium",
  xsmall: "text-xs",
  xxsmall: "text-xs",
  custom: "",
};
