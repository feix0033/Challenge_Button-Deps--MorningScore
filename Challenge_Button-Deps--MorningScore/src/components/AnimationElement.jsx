import { forwardRef, useImperativeHandle, useRef, memo } from "react";
import PropTypes from "prop-types";
import { twClassNames } from "../lib/util";

const AnimationElement = (props, ref) => {
  const animationElementRef = useRef();
  const {
    layout,
    children,
    fromLoadingPercent,
    loadingAnimation,
    spanTransformShine,
    buttonClasses,
    buttonTextSize,
  } = props;

  useImperativeHandle(ref, () => ({
    ref: animationElementRef,
  }));

  return (
    <>
    {/* This part is using for the shine effect that slides across the button */}
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
      {/* This part is the loading animation that fills up the button */}
      {loadingAnimation && (
        <span
          ref={animationElementRef}
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
  );
};

AnimationElement.propTypes = {};

export default memo(forwardRef(AnimationElement));
