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

/*
The following map functions is staric style object that do not re-render in the React component.
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

export const widthMap = (size) => ({
  default: "",
  full: "w-full",
  square: size === "small" ? "w-10" : size === "large" ? "w-12" : "w-11",
});

export const sizeMap = (defaultPadding, layout, textNoWrap) => ({
  large: ["h-12 py-1", { "px-4": defaultPadding && layout !== "text" }],
  default: [
    "h-10",
    { "px-3.5": defaultPadding && layout !== "text" },
    { "h-auto": !textNoWrap },
  ],
  small: ["h-10", { "px-3": defaultPadding && layout !== "text" }],
  xsmall: ["h-8", { "px-2.5": defaultPadding && layout !== "text" }],
  xxsmall: ["h-6", { "px-2": defaultPadding && layout !== "text" }],
  custom: "",
});

export const baseStyling = (
  center,
  fontWeight,
  defaultOutline,
  noTransition,
  textNoWrap
) => [
  "inline-flex",
  { "items-center justify-center": center },
  "text-center",
  [`font-${fontWeight}`],
  "rounded",
  { "outline-none focus-visible:outline-purple": defaultOutline },
  { "transition ease-in-out duration-150": !noTransition },
  { "whitespace-no-wrap": textNoWrap },
  "cursor-pointer",
  "disabled:cursor-default",
  "z-0 relative",
];
