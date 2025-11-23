import gsap from "gsap";

export const useMagnetEffect = (magnetRef) => {
  const moveMagnet = (event) => {
    if (!magnetRef.current) return;
    const magnetButton = event.currentTarget;
    const bounding = magnetButton.getBoundingClientRect();
    const strength = 10;

    gsap.to(magnetRef.current, {
      x: ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) * strength,
      y: ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) * strength,
    });
  };

  const moveOut = (event) => {
    if (!magnetRef.current) return;
    if (magnetRef.current !== event.currentTarget && magnetRef.current?.contains(event.currentTarget)) return;
    gsap.to(magnetRef.current, {
      x: 0,
      y: 0,
      ease: "power4.out",
      duration: 1,
    });
  };

  return { moveMagnet, moveOut };
};
