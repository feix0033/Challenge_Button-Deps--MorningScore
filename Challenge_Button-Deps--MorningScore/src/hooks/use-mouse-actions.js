import gsap from "gsap";

export const useMouseActions = (
  layout,
  buttonRef,
  magnetRef,
  withoutButtonTag,
  setSpanTransformShine
) => {
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

  return { moveMagnet, moveOut, enterAndOut };
};
