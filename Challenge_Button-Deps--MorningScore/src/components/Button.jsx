// The dependancy imports form node_modules
import React, { useRef, createContext, useContext } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useGSAP } from "@gsap/react";

import useButtonLayoutMap from "../hooks/use-button-layout-map.js";
import { useMouseActions } from "../hooks/use-mouse-actions.js";

import { textSizeMap, widthMap, sizeMap, baseStyling } from "../lib/util";

const ButtonContext = createContext();

const Button = React.forwardRef((props, ref) => {
  const {
    layout = "primary",
    width = "default",
    size = "default",
    hoverEnabled = true,
    className,
    containerClassName,
    children,
    active = false,
    // highlight = false, /// Not currently supported here
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

  const magnetRef = useRef();
  const buttonRef = useRef();
  const fillUpAnimRef = useRef();

  const { spanTransformShine, moveMagnet, moveOut, enterAndOut } = useMouseActions(
    ref,
    layout,
    buttonRef,
    magnetRef,
    loadingPercent,
    hasErrors,
    loadingAnimatingCallback,
    withoutButtonTag,
    fillUpAnimRef,
    loadingAnimation,
    fromLoadingPercent
  );

  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  const buttonClasses = classNames(
    baseStyling(center, fontWeight, defaultOutline, noTransition, textNoWrap),
    sizeMap(defaultPadding, layout, textNoWrap)[size],
    widthMap(size)[width],
    textSizeMap[size], // the text size map always exist with the button classes, migrate it into the button classes.
    isLoading ? "cursor-wait border border-purple" : layoutMap[layout][active],
    { [`text-${textColor}`]: textColor },
    className,
    "tracking-wide"
  );

  const LOADING_STYLE = "bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple";

  return (
    <ButtonContext.Provider
      value={{
        layout,
        withoutButtonTag,
        loadingAnimation,
        fromLoadingPercent,
        fillUpAnimRef,
        buttonClasses,
        spanTransformShine,
      }}
    >
      <MagnetWrapper ref={magnetRef} containerClassName={containerClassName} moveMagnet={moveMagnet} moveOut={moveOut}>
        <button
          ref={buttonRef}
          {...forwardProps}
          className={classNames(buttonClasses, {
            "inline-flex": withoutButtonTag,
            [LOADING_STYLE]: isLoading && !withoutButtonTag,
          })}
          onMouseEnter={enterAndOut}
          onMouseOut={enterAndOut}
        >
          {layout === "primary" && <PrimaryShineEffect spanTransformShine={spanTransformShine} />}
          {loadingAnimation && <LoadingEffect buttonClasses={buttonClasses} ref={fillUpAnimRef} />}
          {children}
        </button>
      </MagnetWrapper>
    </ButtonContext.Provider>
  );
});

const MagnetWrapper = React.forwardRef((props, ref) => {
  const { containerClassName, moveMagnet, moveOut, children } = props;
  const { layout, withoutButtonTag } = useContext(ButtonContext);
  const { contextSafe } = useGSAP();

  return layout === "primary" && !withoutButtonTag ? (
    <span
      ref={ref}
      className={classNames(containerClassName, "-m-4 p-4 rounded-full inline-flex box-content")}
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      {children}
    </span>
  ) : (
    children
  );
});

const LoadingEffect = React.forwardRef((props, ref) => (
  <span
    ref={ref}
    className={"absolute top-0 left-0 w-0 overflow-hidden pointer-events-none z-1 -mt-px h-[calc(100%+1px)] text-white"}
  >
    {/* Below here, this element need to add a full width (w-full) that can show the loaiding bar correctly. */}
    <span className={classNames(props.buttonClasses, "bg-purple-700/30 text-white w-full")} />
  </span>
));

const PrimaryShineEffect = React.memo(({ spanTransformShine }) => (
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
};

export default Button;
