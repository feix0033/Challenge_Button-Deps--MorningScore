// The dependancy imports form node_modules
import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useGSAP } from "@gsap/react";

import useButtonLayoutMap from "../hooks/use-button-layout-map.js";
import { useLoadingEffect } from "../hooks/use-mouse-actions.js";

import { useMagnetEffect } from "../hooks/use-magnet-effect.js";
import { usePrimaryShineEffect } from "../hooks/use-primary-shine-effect.js";

const Button = (props) => {
  const {
    layout = "primary",
    width = "default",
    size = "default",
    hoverEnabled = true,
    className,
    containerClassName,
    children,
    active = false,
    withoutButtonTag = false,
    textColor,
    noTransition = false,
    fontWeight = "medium",
    center = true,
    defaultPadding = true,
    defaultOutline = true,
    loadingAnimation = false,
    isLoading = false,
    loadingPercent = 0,
    fromLoadingPercent = 0,
    hasErrors = false,
    textNoWrap = true,
    loadingAnimatingCallback,
    ...forwardProps
  } = props;

  /* This is the style part that I should put them together */
  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  const widthMap = (size) => ({
    default: "",
    full: "w-full",
    square: size === "small" ? "w-10" : size === "large" ? "w-12" : "w-11",
  });

  const sizeMap = (defaultPadding, layout, textNoWrap) => ({
    large: ["h-12 py-1", { "px-4": defaultPadding && layout !== "text" }],
    default: ["h-10 text-sm", { "px-3.5": defaultPadding && layout !== "text" }, { "h-auto": !textNoWrap }],
    small: ["h-10 text-sm", { "px-3": defaultPadding && layout !== "text" }],
    xsmall: ["h-8 text-xs", { "px-2.5": defaultPadding && layout !== "text" }],
    xxsmall: ["h-6 text-xs", { "px-2": defaultPadding && layout !== "text" }],
    custom: "",
  });

  const baseStyling = (center, fontWeight, defaultOutline, noTransition, textNoWrap) => [
    "inline-flex text-center rounded cursor-pointer disabled:cursor-default z-0 relative tracking-wide",
    { "items-center justify-center": center },
    [`font-${fontWeight}`],
    { "outline-none focus-visible:outline-purple": defaultOutline },
    { "transition ease-in-out duration-150": !noTransition },
    { "whitespace-no-wrap": textNoWrap },
    { [`text-${textColor}`]: textColor },
    { "cursor-wait border border-purple": isLoading}
  ];

  const buttonClasses = classNames(
    baseStyling(center, fontWeight, defaultOutline, noTransition, textNoWrap),
    sizeMap(defaultPadding, layout, textNoWrap)[size],
    widthMap(size)[width],
    !isLoading && layoutMap[layout][active],
    className,
  );

  /* Here is the component behaviro */
  const buttonRef = useRef();
  const fillUpAnimRef = useRef();

  useLoadingEffect(
    buttonRef,
    fillUpAnimRef,
    hasErrors,
    fromLoadingPercent,
    loadingPercent,
    loadingAnimation,
    loadingAnimatingCallback
  );

  const { spanTransformShine, enterAndOut } = usePrimaryShineEffect(buttonRef);

  /* The actual rendering component */
  return (
    <MagnetWrapper containerClassName={containerClassName} enabled={layout === "primary" && !withoutButtonTag}>
      <button
        ref={buttonRef}
        {...forwardProps}
        className={classNames(buttonClasses, {
          "inline-flex": withoutButtonTag,
          "bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple":
            isLoading && !withoutButtonTag,
        })}
        onMouseEnter={enterAndOut}
        onMouseOut={enterAndOut}
      >
        {layout === "primary" && <PrimaryShineEffect spanTransformShine={spanTransformShine} />}
        {loadingAnimation && <LoadingEffect buttonClasses={buttonClasses} ref={fillUpAnimRef} />}
        {children}
      </button>
    </MagnetWrapper>
  );
};

const MagnetWrapper = (props) => {
  const { containerClassName, children, enabled } = props;

  const magnetRef = useRef();
  const { contextSafe } = useGSAP();
  const { moveMagnet, moveOut } = useMagnetEffect(magnetRef);

  return enabled ? (
    <span
      ref={magnetRef}
      className={classNames(containerClassName, "-m-4 p-4 rounded-full inline-flex box-content")}
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      {children}
    </span>
  ) : (
    children
  );
};

const PrimaryShineEffect = ({ spanTransformShine }) => (
  <span
    className={classNames(
      "absolute -top-px -left-px -z-1 overflow-hidden pointer-events-none rounded-[3px]",
      "w-[calc(100%+2px)] h-[calc(100%+2px)] bg-purple"
    )}
  >
    <span
      className={classNames(
        "absolute block pointer-events-none z-2 w-[200%] h-full transition-all duration-650",
        "bg-size-[25%] bg-[linear-gradient(120deg,rgba(86,58,201,1),rgba(187,176,233,1),rgba(86,58,201,1))]",
        spanTransformShine
      )}
    />
  </span>
);

const LoadingEffect = React.forwardRef(({ buttonClasses }, ref) => (
  <span
    ref={ref}
    className={"absolute top-0 left-0 w-0 overflow-hidden pointer-events-none z-1 -mt-px h-[calc(100%+1px)] text-white"}
  >
    {/* Below here, this element need to add a full width (w-full) that can show the loaiding bar correctly. */}
    <span className={classNames(buttonClasses, "bg-purple-700/30 text-white w-full")} />
  </span>
));

Button.propTypes = {
  /**
   * layout of buttons, the layout of the button UI (Default = Primary) <br>
   * Types: primary | secondary | borderless
   */
  layout: PropTypes.oneOf([
    "underline",
    "primary",
    "primary-no-anim",
    "secondary",
    "secondary-muted",
    "secondary-serene",
    "stateful",
    "danger",
    "danger-secondary",
    "danger-outline",
    "borderless",
    "text",
    "gray",
    "gray-muted",
    "navigation",
    "clean",
    "muted",
    "circleso",
    "fiverr",
    "toast",
    "none",
    "green",
  ]),
  /**
   * Width of the button<br>
   * Sizes: See tailwind width classes .w-{your class}
   */
  width: PropTypes.string,
  /**
   * Active, represents whether the button is currently active, if the button is active the styling will be changed.
   */
  active: PropTypes.bool,
  /**
   * Size of the button
   */
  size: PropTypes.oneOf(["large", "default", "small", "xsmall", "xxsmall", "custom"]),
  fontWeight: PropTypes.oneOf(["light", "normal", "medium", "semibold", "bold"]),
  hoverEnabled: PropTypes.bool,
  withoutButtonTag: PropTypes.bool,
  textColor: PropTypes.string,
  noTransition: PropTypes.bool,
  center: PropTypes.bool,
  defaultPadding: PropTypes.bool,
  defaultOutline: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasErrors: PropTypes.bool,
  textNoWrap: PropTypes.bool,
  fromLoadingPercent: PropTypes.number,
  loadingPercent: PropTypes.number,
  loadingAnimation: PropTypes.bool,
  loadingAnimatingCallback: PropTypes.func,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  children: PropTypes.node,
  forwardProps: PropTypes.any,
};

export default Button;
