// The dependancy imports form node_modules
import React, { useRef, createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useGSAP } from "@gsap/react";

// The hooks that contain in the offered source.
// Update the paths as needed.
import useButtonLayoutMap from "../hooks/use-button-layout-map.js";
import { useMouseActions } from "../hooks/use-mouse-actions.js";

/* THE HOOKS AND UTILITIES THAT DOES NOT CONTAIN IN THE OFFERED SOURCE
The following hooks and utilities that does not contain in the offered source, 
I created the simple implementations based on the usage. And update the paths as needed.
*/
/* 
Based on the usage, this hook should return a color value string based on the input color name.
that is not necessarily use a React custom hook since that return a constant value without using any of the React hook.
*/
// import useColorValue from './hooks/use-color-value';

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

  const { spanTransformShine, moveMagnet, moveOut, enterAndOut } =
    useMouseActions(
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
      <ButtonWithMagnet
        ref={magnetRef}
        containerClassName={containerClassName}
        moveMagnet={moveMagnet}
        moveOut={moveOut}
      >
        <BaseButton
          ref={buttonRef}
          isLoading={isLoading}
          withoutButtonTag={withoutButtonTag}
          enterAndOut={enterAndOut}
          forwardProps={forwardProps}
        >
          <AnimationElements ref={fillUpAnimRef} />
          {children}
        </BaseButton>
      </ButtonWithMagnet>
    </ButtonContext.Provider>
  );
});

const BaseButton = React.forwardRef((props, ref) => {
  const { isLoading, children, enterAndOut, forwardProps } = props;
  const { withoutButtonTag, buttonClasses } = useContext(ButtonContext);

  const baseButtonCn = useMemo(
    () =>
      classNames(
        buttonClasses,
        withoutButtonTag
          ? "inline-flex"
          : isLoading
          ? "bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple"
          : ""
      ),
    [withoutButtonTag, isLoading, buttonClasses]
  );

  // We don't need to use React.memo to cache the component, because the mouse action will change all the time when the mouse enter and out.
  return (
    <button
      ref={ref}
      {...forwardProps}
      className={baseButtonCn}
      onMouseEnter={enterAndOut}
      onMouseOut={enterAndOut}
    >
      {children}
    </button>
  );
});

const ButtonWithMagnet = React.forwardRef((props, ref) => {
  const { containerClassName, moveMagnet, moveOut, children } = props;
  const { layout, withoutButtonTag } = useContext(ButtonContext);
  const { contextSafe } = useGSAP();

  const buttonWithMagnet = useMemo(
    () =>
      classNames(
        containerClassName,
        "-m-4 p-4 rounded-full inline-flex box-content"
      ),
    [containerClassName]
  );

  // display the magnet button when the layout is primary and withoutButtonTag is false
  const hasMagnetWarp = layout === "primary" && !withoutButtonTag;

  // We don't need to use React.memo to cache the component, because the mouse action will change all the time when the mouse enter and out.
  return hasMagnetWarp ? (
    <span
      ref={ref}
      className={buttonWithMagnet}
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      {children}
    </span>
  ) : (
    children
  );
});

const AnimationElements = React.forwardRef((props, ref) => {
  const { children } = props;

  const {
    layout,
    spanTransformShine,
    loadingAnimation,
    fromLoadingPercent,
    buttonClasses,
  } = useContext(ButtonContext);

  const primaryAnimationContainerCn = classNames(
    "absolute overflow-hidden bg-purple pointer-events-none",
    "-z-[1] -top-[1px] -left-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] rounded-[3px]"
  );

  const primaryAnimationCn = useMemo(
    () =>
      classNames(
        "absolute block pointer-events-none",
        spanTransformShine,
        "z-[2] transition-all duration-[650ms] w-[200%] h-[100%] bg-[length:25%] bg-[linear-gradient(120deg,rgba(86,58,201,1),rgba(187,176,233,1),rgba(86,58,201,1))]"
      ),
    [spanTransformShine]
  );

  const loadingAnimationContainerCn = classNames(
    "absolute top-0 left-0 w-0 overflow-hidden pointer-events-none",
    "-left-[1px] z-[1] -mt-[1px] h-[calc(100%+1px)] text-white"
  );

  const loadingAnimationCn = useMemo(
    () =>
      classNames(
        buttonClasses,
        "bg-purple-700/30 text-white w-full" // add w-full success make the bar full fill
      ),
    [buttonClasses]
  );

  return (
    <>
      {layout === "primary" && (
        <span className={primaryAnimationContainerCn}>
          <span className={primaryAnimationCn} />
        </span>
      )}
      {loadingAnimation && (
        <span
          ref={ref}
          className={loadingAnimationContainerCn}
          style={{
            width: `${fromLoadingPercent}%`,
          }}
        >
          <span className={loadingAnimationCn}>{children}</span>
        </span>
      )}
    </>
  );
});

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
