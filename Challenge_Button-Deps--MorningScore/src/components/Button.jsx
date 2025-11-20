// The dependancy imports form node_modules
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import gsap from "gsap";
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

import {
  twClassNames,
  textSizeMap,
  widthMap,
  sizeMap,
  baseStyling,
} from "../lib/util";

import ErrorViewTemplateSmall from "./ErrorViewTemplateSmall";
import Widget from "./Widget";

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

  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: "-100% 0%",
  });
  const magnetRef = useRef();
  const buttonRef = useRef();
  const fillUpAnimRef = useRef();
  const timelineRef = useRef(gsap.timeline({ paused: true }));

  const { moveMagnet, moveOut, enterAndOut } = useMouseActions(
    layout,
    buttonRef,
    magnetRef,
    withoutButtonTag,
    setSpanTransformShine
  );
  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  const buttonClasses = twClassNames(
    baseStyling(center, fontWeight, defaultOutline, noTransition, textNoWrap),
    sizeMap(defaultPadding, layout, textNoWrap)[size],
    isLoading ? "cursor-wait border border-purple" : layoutMap[layout][active],
    widthMap(size)[width],
    { [`text-${textColor}`]: textColor },
    className,
    "tracking-wide"
  );
  const buttonTextSize = textSizeMap[size];

  const animationElements = useMemo(
    () => (
      <>
        {layout === "primary" && (
          <span
            className="absolute overflow-hidden bg-purple pointer-events-none"
            style={{
              zIndex: -1,
              top: -1,
              left: -1,
              width: "calc(100% + 2px)",
              height: "calc(100% + 2px)",
              borderRadius: 3,
            }}
          >
            <span
              className="absolute block pointer-events-none"
              style={{
                ...spanTransformShine,
                zIndex: 2,
                transition: "all 650ms",
                width: "200%",
                height: "100%",
                backgroundSize: "25%",
                background:
                  "linear-gradient(120deg, rgba(86, 58, 201, 1), rgba(187, 176, 233, 1), rgba(86, 58, 201, 1))",
              }}
            />
          </span>
        )}
        {loadingAnimation && (
          <span
            ref={fillUpAnimRef}
            className="absolute top-0 left-0 w-0 overflow-hidden pointer-events-none"
            style={{
              zIndex: 1,
              width: `${fromLoadingPercent}%`,
              marginTop: -1,
              height: "calc(100% + 1px)",
              left: -1,
              color: "white",
            }}
          >
            <span
              className={twClassNames(
                buttonClasses,
                "bg-purple text-white",
                buttonTextSize
              )}
            >
              {children}
            </span>
          </span>
        )}
      </>
      // remove purple which is no usage.
    ),
    [
      layout,
      spanTransformShine,
      loadingAnimation,
      fromLoadingPercent,
      buttonClasses,
      buttonTextSize,
      children,
    ]
  );

  useGSAP(() => {
    if (buttonRef.current && fillUpAnimRef.current) {
      if (loadingAnimation && typeof loadingPercent === "number") {
        const timeline = timelineRef.current;
        timeline.clear();
        if (!hasErrors) {
          timeline
            .to(fillUpAnimRef.current, {
              width: `${fromLoadingPercent}%`,
              duration: 0,
            })
            .to(fillUpAnimRef.current, {
              width: `${loadingPercent}%`,
              duration: 1,
              ease: "circ.out",
              onStart: () => {
                loadingAnimatingCallback?.(true);
              },
            })
            .to(buttonRef.current, {
              scale: loadingPercent === 100 ? 1.1 : 1,
              duration: 0.5,
              delay: -0.5,
              ease: "power4.inOut",
              repeat: 1,
              yoyo: true,
              yoyoEase: "power4.inOut",
            })
            .to(buttonRef.current, {
              duration: 0.5,
              onComplete: () => {
                loadingAnimatingCallback?.(false);
              },
            });
        } else {
          timeline.to(fillUpAnimRef.current, {
            backgroundColor: "red", // change the red value to semantic css variable
            width: "0%",
            duration: 1,
            ease: "circ.out",
            onComplete: () => {
              loadingAnimatingCallback?.(false);
            },
          });
        }
      }
    }
  }, [loadingAnimation, loadingPercent, hasErrors]);

  useImperativeHandle(ref, () => buttonRef.current);

  useEffect(() => {
    timelineRef.current.restart();
  }, [loadingPercent]);

  return (
    <Widget FallbackComponent={ErrorViewTemplateSmall}>
      {withoutButtonTag ? (
        <span
          ref={buttonRef}
          className={classNames(buttonClasses, "inline-flex", buttonTextSize)}
          {...forwardProps}
          onMouseEnter={enterAndOut}
          onMouseOut={enterAndOut}
        >
          {animationElements}
          {children}
        </span>
      ) : layout === "primary" ? (
        <ButtonWithMagnet
          ref={magnetRef}
          containerClassName={containerClassName}
          moveMagnet={moveMagnet}
          moveOut={moveOut}
          buttonRef={buttonRef}
          buttonClasses={buttonClasses}
          buttonTextSize={buttonTextSize}
          isLoading={isLoading}
          animationElements={animationElements}
          enterAndOut={enterAndOut}
          forwardProps={forwardProps}
        >
          {children}
        </ButtonWithMagnet>
      ) : (
        <BaseButton
          ref={buttonRef}
          buttonClasses={buttonClasses}
          buttonTextSize={buttonTextSize}
          isLoading={isLoading}
          animationElements={animationElements}
          enterAndOut={enterAndOut}
          forwardProps={forwardProps}
        >
          {children}
        </BaseButton>
      )}
    </Widget>
  );
});

const BaseButton = React.forwardRef((props, ref) => {
  const {
    buttonClasses,
    buttonTextSize,
    isLoading,
    animationElements,
    children,
    enterAndOut,
    forwardProps,
  } = props;
  return (
    <button
      ref={ref}
      className={classNames(
        buttonClasses,
        isLoading
          ? "bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple"
          : "",
        buttonTextSize
      )}
      {...forwardProps}
      onMouseEnter={enterAndOut}
      onMouseOut={enterAndOut}
    >
      {animationElements}
      {children}
    </button>
  );
});

const ButtonWithMagnet = React.forwardRef((props, ref) => {
  const {
    containerClassName,
    moveMagnet,
    moveOut,
    buttonRef,
    buttonClasses,
    buttonTextSize,
    isLoading,
    animationElements,
    children,
    enterAndOut,
    forwardProps,
  } = props;

  const { contextSafe } = useGSAP();

  return (
    <span
      className={twClassNames(
        containerClassName,
        "-m-4 p-4 rounded-full inline-flex box-content"
      )}
      ref={ref}
      // the moveMagnet and moveOut are for magnet effect that should not directly passed into the React component, that will cause the unexpected behaviro.
      // The Refs directly pass into the span element will re-render mutiple times may not working as expected.
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      <BaseButton
        ref={buttonRef}
        buttonClasses={buttonClasses}
        buttonTextSize={buttonTextSize}
        isLoading={isLoading}
        animationElements={animationElements}
        enterAndOut={enterAndOut}
        forwardProps={forwardProps}
      >
        {children}
      </BaseButton>
    </span>
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
