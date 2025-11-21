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

/* This component was not include the resource, I create a temporary component instead */
import ErrorViewTemplateSmall from "services/bugsnag/ErrorViewTemplateSmall";
/* Same above, create a temporary component */
import Widget from "widgets/Widget";

import useButtonLayoutMap from "ui/app/inputs/buttons/partials/use-button-layout-map";
// npm i @gsap/react -D
import { useGSAP } from "@gsap/react";
/* 
The utility is not included in the resource. 
But since it only using for get two color values, 
And one is no usage, just simply remove it and set the semantic css color instead 
*/
import useColorValue from "support/hooks/ui/styling/use-color-value";
// npm i gsap -D
import gsap from "gsap";
/* 
The utility is not included in the resource.
During the refactoring, here also import the classNames util that can instead of this. 
So simple implemented and then removed it.
*/
import twClassNames from "support/utilities/tailwind/twClassNames";

/**
 * A wrapper component for adding a button
 */

const Button = React.forwardRef((props, ref) => {
  /* 
  Component attributes 
  Here is the destructuring of props with default values. 
  For further refactoring, maybe it can be encapsulate to muti object/array instead of long list.
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
  Call the useColorValue hook with the default colors, here the color is hard code. 
  The hook useColorValue can not be fround from the resource.
  After searching in the code base: 
  - The purple has no usage that need to be declear. It can be remove.
  - The red has only one usage that can use semantic css color instead. 
  */
  const purple = useColorValue("purple");
  const red = useColorValue("red");

  /* Basic button styles using tailwind utility class. 
  As a static variable, we don't need it re-initiate during the component re-render. 
  Move it out of the component can make it only declear once. 
  So I change it as a funciton that can accept the parameters.
  And put it into a util file instead.
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
  Same reason above, change to a function and move it into the util file.
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
  Same reason above, but since this is a simple object without parameter/variables,
  move it into the util file.
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
  Same reason above, change to a function and move it into the util file.
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
  Change the twClassNames function to classname. 
  This class are using for two sub components:
  1. button component that shows the basic button.
  2. animationElements that handle the primary buton animation and loading animation.
  Because there are two sub component need to be passed in, and the two components are nested.
  Therefore, move it into the ButtonContext to avoid the "Prop Drilling".
  Normally, the variable that included parameters, we may use React useMemo hooks to handle the updata
  and cashe to avoid unnesacery re-culculate. But this variable has long dependency 
  and most of them are props from parent component, It should re-generate when the component re-render.
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
  This variable are in the buttonClasses variable all the time as one part of the button class.
  So just simple migrate it into the buttonClasses to easy to manage.
  */
  const buttonTextSize = textSizeMap[size];

  /* 
  Bring the ButtonWithMagnet DOM and be operated by gsap to make the button can slitly move following the mouse.
  */
  const magnetRef = useRef();

  /* 
  Function to handle the magnet effect on mouse move.
  This function can be encapsulate into a customer hooks.
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
  Same as above, encapsulate into the customer hooks.
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
  This hook only used by  ButtonWithMagnet component,
  it can be move into the component so when the component has not mount then it will not be invoke.
  */
  const { contextSafe } = useGSAP();

  /*
  Using the state to handle the shine effect on the button.
  The initail variable that may use tailwind css instead of the style.
  That will easy to manage the changes.
  */
  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: "-100% 0%",
  });

  /*
  Bring the button DOM to let the style and gsap control.
  Also, it eject out of component for further useage.
  */
  const buttonRef = useRef();

  /*
  Eject the button DOM out of the component.
  */
  useImperativeHandle(ref, () => buttonRef.current);

  /*
  Encapsulate this component into customer hooks.
  After encapsulate, the hook will automaticlly to update the layout and DOM change, 
  So that is not nesacery to use the useCallback hook.
  */
  const enterAndOut = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!buttonRef.current) return;

      // Handle mouseenter event
      if (e.type === "mouseenter") {
        if (layout === "primary") {
          /* Chanage the style to tailwindcss utility class */
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
            /* Chanage the style to tailwindcss utility class */
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
  Bring the animationElements DOM to let the style and gsap control.
  */
  const fillUpAnimRef = useRef();

  /*
  The component that display the loading animation that step by step fillup the button.
  This is a jsx component, it should not declear here, and lead it to re-render each of times
  the button re-render. 
  Also useMemo is using for monitoring the change in the variabe culculation result, to avoid unnesacery
  re-calculate. That is not using for the jsx component. 
  Here should use React.memo to caching the component and void re-render.
  But unless some of specitial situation that need to memo the component, in most situation, that we can let the 
  React manage the component re-render instead of the React.memo.
  */
  const animationElements = useMemo(
    () => (
      /* 
      The follwing styles could be extract as mutiple variables and useMemo to tracking the variables change.
      And for the inline-styles, That is not a mistake, but for consistence, we may change it to tailwindcss utility class.
      Except the 'fromLoadingPercent' that should use the inline-style because the tailwindcss can not support JIT compiling.
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
    /* There are not usage for the purple, should don't be here. */
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
  The timeline ref to let the gsap manage the animation timeline. 
  But since the timeline has side effect posibility, we should init it the useEffec,
  alternativly, we can let the useGSAP hook to manage it, the hook handled and optimized the side effect.
  */
  const timelineRef = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    timelineRef.current.restart();
  }, [loadingPercent]);

  /* 
  The hook from @gsap/react that handle the animation.
  */
  useGSAP(() => {
    /*
    The follwoing lines are nest if statement that is a traditional bad small in the code.
    Should split them into mutiple statement. fx. if (true) return;
    */
    if (buttonRef.current && fillUpAnimRef.current) {
      if (loadingAnimation && typeof loadingPercent === "number") {
        const timeline = timelineRef.current;
        timeline.clear();
        /* here also can split the statement to if (hasErrors) { do this and return;} */
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
  Same as the animation element, this component should be move out of the parent component.
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
   * This magnet button will has the magnet effect when hover, the button will follow the mouse cursor slighty.
   * Only the layout is primary will have this effect.
   * Should be move out of the component as a warper component.
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
  Since the Widget appeared in here and also warped the Button component.
  And the condition only using for display the ButtonWithMagent warp 
  (the button also included in the ButtonWithMagnet),
  We can move the !withoutButtonTag condition into the ButtonWithMagnet 
  to decide use the magnet effert or not. 
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
      This span acturlly is the button component only has a small style different.
      So it can be migrate into the button component and add the withoutButtonTag condition.
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
