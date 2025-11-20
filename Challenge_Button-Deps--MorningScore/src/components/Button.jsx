// The dependancy imports form node_modules
import React, {
  useCallback,
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

/* THE HOOKS AND UTILITIES THAT DOES NOT CONTAIN IN THE OFFERED SOURCE
The following hooks and utilities that does not contain in the offered source, 
I created the simple implementations based on the usage. And update the paths as needed.
*/
/* 
Based on the usage, this hook should return a color value string based on the input color name.
that is not necessarily use a React custom hook since that return a constant value without using any of the React hook.
*/
// import useColorValue from './hooks/use-color-value';

import Widget from "./Widget";
import { twClassNames } from "../lib/util";
import ErrorViewTemplateSmall from "./ErrorViewTemplateSmall";

/**
 * A wrapper component for adding a button
 */

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

  // const purple = useColorValue('purple');
  // const red = useColorValue('red');

  const baseStyling = [
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

  const sizeMap = {
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
  };

  const textSizeMap = {
    large: "",
    default: "text-sm",
    small: "text-smedium",
    xsmall: "text-xs",
    xxsmall: "text-xs",
    custom: "",
  };

  const widthMap = {
    default: "",
    full: "w-full",
    square: size === "small" ? "w-10" : size === "large" ? "w-12" : "w-11",
  };

  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  const buttonClasses = twClassNames(
    baseStyling,
    sizeMap[size],
    isLoading ? "cursor-wait border border-purple" : layoutMap[layout][active],
    widthMap[width],
    { [`text-${textColor}`]: textColor },
    className,
    "tracking-wide"
  );

  const buttonTextSize = textSizeMap[size];

  const magnetRef = useRef();
  const moveMagnet = (event) => {
    if (!(layout === "primary" && !withoutButtonTag)) return;
    if (!magnetRef.current) return;
    const magnetButton = event.currentTarget;
    const bounding = magnetButton.getBoundingClientRect();
    const strength = 10;

    gsap.to(magnetRef.current, {
      x:
        ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
        strength,
      y:
        ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
        strength,
    });
  };

  const moveOut = (event) => {
    if (!(layout === "primary" && !withoutButtonTag)) return;
    if (!magnetRef.current) return;
    if (
      magnetRef.current !== event.currentTarget &&
      magnetRef.current?.contains(event.currentTarget)
    )
      return;
    gsap.to(magnetRef.current, {
      x: 0,
      y: 0,
      ease: "power4.out",
      duration: 1,
    });
  };

  const { contextSafe } = useGSAP();

  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: "-100% 0%",
  });
  const buttonRef = useRef();

  useImperativeHandle(ref, () => buttonRef.current);

  const enterAndOut = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!buttonRef.current) return;

      // Handle mouseenter event
      if (e.type === "mouseenter") {
        if (layout === "primary") {
          setSpanTransformShine({
            translate: "100% 0%",
          });
        }
      }

      // mouseout semantics: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget
      // the element that triggered the event, entered to, exited from
      // console.log(e.currentTarget, e.relatedTarget, e.target);

      // Handle mouseleave event
      if (e.type === "mouseout") {
        // Check if the mouse is leaving the button and not entering a child element
        if (
          buttonRef.current &&
          !buttonRef.current?.contains(e.relatedTarget)
        ) {
          if (layout === "primary") {
            setSpanTransformShine({
              translate: "-100% 0%",
            });
          }
        }
      }
    },
    [layout, withoutButtonTag]
  );

  const fillUpAnimRef = useRef();

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
    [layout, spanTransformShine, loadingAnimation]
  );

  const timelineRef = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    timelineRef.current.restart();
  }, [loadingPercent]);

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

  const button = (
    <button
      ref={buttonRef}
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

  const buttonWithMagnet = (
    <span
      className={twClassNames(
        containerClassName,
        "-m-4 p-4 rounded-full inline-flex box-content"
      )}
      ref={magnetRef}
      // the moveMagnet and moveOut are for magnet effect that should not directly passed into the React component, that will cause the unexpected behaviro.
      // The Refs directly pass into the span element will re-render mutiple times may not working as expected.
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      {button}
    </span>
  );

  if (!withoutButtonTag) {
    return (
      <Widget FallbackComponent={ErrorViewTemplateSmall}>
        {layout === "primary" ? buttonWithMagnet : button}
      </Widget>
    );
  }

  return (
    <Widget FallbackComponent={ErrorViewTemplateSmall}>
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
    </Widget>
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
