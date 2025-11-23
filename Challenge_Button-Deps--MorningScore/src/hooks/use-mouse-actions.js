import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";

export const useMouseActions = (
  layout,
  buttonRef,
  loadingPercent,
  hasErrors,
  loadingAnimatingCallback,
  fillUpAnimRef,
  loadingAnimation,
  fromLoadingPercent
) => {
  /* Since I'm using the React 19, there are no warning for this. It just simplly avoid the version warning.*/
  /* It is not necessary to put it here, but for secure, I just insert it. */
  gsap.registerPlugin(useGSAP);

  const timelineRef = useRef(null);

  const [spanTransformShine, setSpanTransformShine] = useState("-translate-x-full");

  const enterAndOut = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!buttonRef.current) return;

    // Handle mouseenter event
    if (e.type === "mouseenter") {
      if (layout === "primary") {
        setSpanTransformShine("translate-x-full");
      }
    }

    // mouseout semantics: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget
    // the element that triggered the event, entered to, exited from
    // console.log(e.currentTarget, e.relatedTarget, e.target);

    // Handle mouseleave event
    if (e.type === "mouseout") {
      // Check if the mouse is leaving the button and not entering a child element
      if (buttonRef.current && !buttonRef.current?.contains(e.relatedTarget)) {
        if (layout === "primary") {
          setSpanTransformShine("-translate-x-full");
        }
      }
    }
  };

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

  /* 
  We shouldn't explore the button ref out of this scorp, that will leading to unexpect behaviro.
  useImperativeHandle(ref, () => buttonRef.current);
  */

  useEffect(() => {
    timelineRef.current?.restart();
  }, [loadingPercent]);

  return { spanTransformShine, enterAndOut };
};
