// The dependancy imports form node_modules
import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  createContext,
  useContext,
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
  textSizeMap,
  widthMap,
  sizeMap,
  baseStyling,
} from "../lib/util";

import ErrorViewTemplateSmall from "./ErrorViewTemplateSmall";
import Widget from "./Widget";

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

  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: "-100% 0%",
  });
  const magnetRef = useRef();
  const buttonRef = useRef();
  const fillUpAnimRef = useRef();
  const timelineRef = useRef(null);

  const { moveMagnet, moveOut, enterAndOut } = useMouseActions(
    layout,
    buttonRef,
    magnetRef,
    withoutButtonTag,
    setSpanTransformShine
  );

  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  const buttonClasses = classNames(
    baseStyling(center, fontWeight, defaultOutline, noTransition, textNoWrap),
    sizeMap(defaultPadding, layout, textNoWrap)[size],
    isLoading ? "cursor-wait border border-purple" : layoutMap[layout][active],
    widthMap(size)[width],
    { [`text-${textColor}`]: textColor },
    className,
    "tracking-wide",
    textSizeMap[size] // the text size map always exist with the button classes, migrate it into the button classes.
  );

  useGSAP(
    () => {
      // if the buttonRef and fillUpAnimRef is not exist, we don't need to create the animation instance.
      if (!(buttonRef.current && fillUpAnimRef.current)) return;
      if (!(loadingAnimation && typeof loadingPercent === "number")) return;
      // initial gsap timelin, because the side effect, the initial should be in useEffect, the useGSAP already optimazed it.
      timelineRef.current = gsap.timeline({ paused: true });

      const timeline = timelineRef.current;
      timeline.clear();

      if (hasErrors) {
        // this animation has an issue, when there are missing the return, the red backgroud will display, otherwise it is not.
        // todo: need to fix the animation red background has not effert.
        timeline.to(fillUpAnimRef.current, {
          backgroundColor: "red", // change the red value to semantic css variable
          width: "0%",
          duration: 1,
          ease: "circ.out",
          onComplete: () => {
            loadingAnimatingCallback?.(false);
          },
        });
        return;
      }

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
    },
    {
      dependencies: [loadingAnimation, loadingPercent, hasErrors],
      scope: [fillUpAnimRef, buttonRef], // add the scop will let gsap automotically kill the animation process when the component unmounted.
    }
  );

  useImperativeHandle(ref, () => buttonRef.current);

  useEffect(() => {
    timelineRef.current?.restart();
  }, [loadingPercent]);

  return (
    <ButtonContext.Provider
      value={{
        layout,
        withoutButtonTag,
        spanTransformShine,
        loadingAnimation,
        fromLoadingPercent,
        fillUpAnimRef,
        buttonClasses,
      }}
    >
      <Widget FallbackComponent={ErrorViewTemplateSmall}>
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
      </Widget>
    </ButtonContext.Provider>
  );
});

const BaseButton = React.forwardRef((props, ref) => {
  const { isLoading, children, enterAndOut, forwardProps } = props;

  const { withoutButtonTag, buttonClasses } =
    useContext(ButtonContext);

  return (
    <button
      ref={ref}
      className={classNames(
        buttonClasses,
        withoutButtonTag
          ? "inline-flex"
          : isLoading
          ? "bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple"
          : "",
      )}
      {...forwardProps}
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

  // display the magnet button when the layout is primary and withoutButtonTag is false
  return layout === "primary" && !withoutButtonTag ? (
    <span
      className={classNames(
        containerClassName,
        "-m-4 p-4 rounded-full inline-flex box-content"
      )}
      ref={ref}
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
  const {
    layout,
    spanTransformShine,
    loadingAnimation,
    fromLoadingPercent,
    buttonClasses,
  } = useContext(ButtonContext);

  const { children } = props;

  return (
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
          ref={ref}
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
            className={classNames(
              buttonClasses,
              "bg-purple-700/30 text-white w-full", // add w-full success make the bar full fill.
            )}
          >
            {children}
          </span>
        </span>
      )}
    </>
    // remove purple which is no usage.
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
