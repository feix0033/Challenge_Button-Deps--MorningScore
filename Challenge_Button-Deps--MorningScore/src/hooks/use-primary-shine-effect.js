import { useState } from "react";

export const usePrimaryShineEffect = (buttonRef) => {
  const [spanTransformShine, setSpanTransformShine] = useState("-translate-x-full");

  const enterAndOut = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!buttonRef.current) return;

    if (e.type === "mouseenter") {
      setSpanTransformShine("translate-x-full");
    }
    if (e.type === "mouseout") {
      !buttonRef.current?.contains(e.relatedTarget) && setSpanTransformShine("-translate-x-full");
    }
  };

  return { spanTransformShine, enterAndOut };
};
