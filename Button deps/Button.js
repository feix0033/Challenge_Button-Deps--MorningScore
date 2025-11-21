/* From the useImperativeHandle, useRef hook, I can see this is React 16+ */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
// npm i prop-types -D
import PropTypes from "prop-types";
// npm i classnames -D
import classNames from "classnames";

/* This component was not included in the resource, so I created a temporary component instead */
import ErrorViewTemplateSmall from "services/bugsnag/ErrorViewTemplateSmall";
/* Same as above, created a temporary component */
import Widget from "widgets/Widget";

import useButtonLayoutMap from "ui/app/inputs/buttons/partials/use-button-layout-map";
// npm i @gsap/react -D
import { useGSAP } from "@gsap/react";
/*
The utility is not included in the resource.
But since it is only used to get two color values,
and one has no usage, simply remove it and use semantic CSS color instead.
*/
import useColorValue from "support/hooks/ui/styling/use-color-value";
// npm i gsap -D
import gsap from "gsap";
/*
The utility is not included in the resource.
During refactoring, the classNames util was also imported and can replace this.
So it was simply implemented and then removed.
*/
import twClassNames from "support/utilities/tailwind/twClassNames";

/**
 * A wrapper component for adding a button
 */

const Button = React.forwardRef((props, ref) => {
  /*
  Component attributes
  Here is the destructuring of props with default values.
  For further refactoring, maybe it can be encapsulated into multiple objects/arrays instead of a long list.
  */
  const {
    layout = "primary",
    width = "default",
    size = "default",
    hoverEnabled = true,
    className,
    containerClassName,
    children,
    active = false,
    highlight = false, /// Not currently supported here
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

  /*
  Call the useColorValue hook with the default colors; here the color is hardcoded.
  The hook useColorValue cannot be found in the resource.
  After searching in the codebase:
  - The purple has no usage that needs to be declared. It can be removed.
  - The red has only one usage that can use semantic CSS color instead.
  */
  const purple = useColorValue("purple");
  const red = useColorValue("red");

  /* Basic button styles using Tailwind utility classes.
  As a static variable, we don't need it to re-initialize during component re-render.
  Moving it out of the component makes it only declare once.
  So I changed it to a function that can accept parameters
  and put it into a util file instead.
  */
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

  /* Button size selector
  Same reason as above, changed to a function and moved it into the util file.
  */
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

  /*
  Text size mapping for different button sizes
  Same reason as above, but since this is a simple object without parameters/variables,
  moved it into the util file.
  */
  const textSizeMap = {
    large: "",
    default: "text-sm",
    small: "text-smedium",
    xsmall: "text-xs",
    xxsmall: "text-xs",
    custom: "",
  };

  /*
  Width mapping for different button widths
  Same reason as above, changed to a function and moved it into the util file.
  */
  const widthMap = {
    default: "",
    full: "w-full",
    square: size === "small" ? "w-10" : size === "large" ? "w-12" : "w-11",
  };

  /*
  Layout mapping for different button layouts
  This hook is exported from 'partials/use-button-layout-map'
  */
  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  /*
  Combine all the class names for the button
  Changed the twClassNames function to classNames.
  These classes are used for two sub-components:
  1. button component that shows the basic button.
  2. animationElements that handles the primary button animation and loading animation.
  Because there are two sub-components that need to be passed in, and the two components are nested,
  therefore, move it into the ButtonContext to avoid "Prop Drilling".
  Normally, for variables that include parameters, we may use React useMemo hooks to handle the update
  and cache to avoid unnecessary re-calculation. But this variable has long dependencies
  and most of them are props from the parent component, so it should re-generate when the component re-renders.
  So I didn't put it into the useMemo hook.
  */
  const buttonClasses = twClassNames(
    baseStyling,
    sizeMap[size],
    isLoading ? "cursor-wait border border-purple" : layoutMap[layout][active],
    widthMap[width],
    { [`text-${textColor}`]: textColor },
    className,
    "tracking-wide"
  );

  /*
  Determine the text size class based on the size prop
  This variable is in the buttonClasses variable all the time as one part of the button class.
  So simply migrate it into the buttonClasses for easier management.
  */
  const buttonTextSize = textSizeMap[size];

  /*
  Reference to the ButtonWithMagnet DOM, operated by GSAP to make the button slightly move following the mouse.
  */
  const magnetRef = useRef();

  /*
  Function to handle the magnet effect on mouse move.
  This function can be encapsulated into a custom hook.
  */
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

  /*
  Function to reset the magnet effect on mouse out.
  Same as above, encapsulate into a custom hook.
  */
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

  /*
  Stop the animation when the component has been unmounted.
  This hook is only used by the ButtonWithMagnet component;
  it can be moved into the component so when the component has not mounted, it will not be invoked.
  */
  const { contextSafe } = useGSAP();

  /*
  Using state to handle the shine effect on the button.
  The initial variable could use Tailwind CSS instead of inline styles,
  which would make it easier to manage changes.
  */
  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: "-100% 0%",
  });

  /*
  Reference to the button DOM for style and GSAP control.
  Also, it is exposed outside the component for further usage.
  */
  const buttonRef = useRef();

  /*
  Expose the button DOM outside the component.
  */
  useImperativeHandle(ref, () => buttonRef.current);

  /*
  Encapsulate this into a custom hook.
  After encapsulation, the hook will automatically update on layout and DOM changes,
  so it is not necessary to use the useCallback hook.
  */
  const enterAndOut = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!buttonRef.current) return;

      // Handle mouseenter event
      if (e.type === "mouseenter") {
        if (layout === "primary") {
          /* Change the style to Tailwind CSS utility class */
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
            /* Change the style to Tailwind CSS utility class */
            setSpanTransformShine({
              translate: "-100% 0%",
            });
          }
        }
      }
    },
    /* withoutButtonTag is not the dependency in the function */
    [layout, withoutButtonTag]
  );

  /*
  Reference to the animationElements DOM for style and GSAP control.
  */
  const fillUpAnimRef = useRef();

  /*
  The component that displays the loading animation that step by step fills up the button.
  This is a JSX component; it should not be declared here, as it leads to re-rendering each time
  the button re-renders.
  Also, useMemo is used for monitoring changes in variable calculation results to avoid unnecessary
  re-calculation. It is not intended for JSX components.
  Here we should use React.memo to cache the component and avoid re-render.
  But unless there is some special situation that needs to memo the component, in most situations we can let
  React manage the component re-render instead of using React.memo.
  */
  const animationElements = useMemo(
    () => (
      /*
      The following styles could be extracted as multiple variables and use useMemo to track the variable changes.
      As for the inline styles, that is not a mistake, but for consistency, we may change them to Tailwind CSS utility classes.
      Except for 'fromLoadingPercent', which should use inline styles because Tailwind CSS cannot support JIT compiling for dynamic values.
      */
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
    ),
    /* There is no usage for purple; it should not be here. */
    [layout, spanTransformShine, loadingAnimation, purple]
  );

  /*
  This part is handling the loading animation logic for the button.
  It uses useEffect to restart the animation timeline whenever the loadingPercent changes.
  If loadingAnimation is true and loadingPercent is a number, it creates a GSAP timeline to animate the fill-up effect.
  If there are no errors, it animates the width of the fill-up element from fromLoadingPercent to loadingPercent,
  and also adds a scaling effect to the button when loadingPercent reaches 100%.
  If there are errors, it animates the fill-up element to shrink back to 0% width and changes its color to red.
  */
  /*
  The timeline ref to let GSAP manage the animation timeline.
  But since the timeline has potential side effects, we should initialize it in useEffect;
  alternatively, we can let the useGSAP hook manage it, as the hook handles and optimizes side effects.
  */
  const timelineRef = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    timelineRef.current.restart();
  }, [loadingPercent]);

  /*
  The hook from @gsap/react that handles the animation.
  */
  useGSAP(() => {
    /*
    The following lines are nested if statements, which is a traditional code smell.
    Should split them into multiple statements, e.g., if (true) return;
    */
    if (buttonRef.current && fillUpAnimRef.current) {
      if (loadingAnimation && typeof loadingPercent === "number") {
        const timeline = timelineRef.current;
        timeline.clear();
        /* Here we could also split the statement to: if (hasErrors) { do this and return; } */
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
            backgroundColor: red,
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

  /*
  The normal button has the shine effect when layout is primary.
  Same as the animation element, this component should be moved out of the parent component.
  */
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

  /**
   * This magnet button will have the magnet effect on hover; the button will follow the mouse cursor slightly.
   * Only the primary layout will have this effect.
   * Should be moved out of the component as a wrapper component.
   */
  const buttonWithMagnet = (
    <span
      className={twClassNames(
        containerClassName,
        "-m-4 p-4 rounded-full inline-flex box-content"
      )}
      ref={magnetRef}
      onMouseMove={contextSafe(moveMagnet)}
      onMouseLeave={contextSafe(moveOut)}
    >
      {button}
    </span>
  );

  /*
  Since the Widget appears here and also wraps the Button component,
  and the condition is only used to display the ButtonWithMagnet wrapper
  (the button is also included in the ButtonWithMagnet),
  we can move the !withoutButtonTag condition into the ButtonWithMagnet
  to decide whether to use the magnet effect or not.
  */
  if (!withoutButtonTag) {
    return (
      <Widget FallbackComponent={ErrorViewTemplateSmall}>
        {layout === "primary" ? buttonWithMagnet : button}
      </Widget>
    );
  }

  return (
    <Widget FallbackComponent={ErrorViewTemplateSmall}>
      {/*
      This span is actually the button component with only a small style difference.
      So it can be migrated into the button component by adding the withoutButtonTag condition.
      */}
      {/* Change the tag to button */}
      <span
        ref={buttonRef}
        /* Add the withoutButtonTag condition here. */
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
