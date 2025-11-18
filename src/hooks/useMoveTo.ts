import { useRef, useEffect } from "react";
import { gsap } from "gsap";

type Direction = "toBottom" | "toTop" | "toLeft" | "toRight";

const useMoveTo = function (
  direction: Direction,
  duration: number = 1,
  delay: number = 0,
  fixedTransform: string = ""
) {
  const eleRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const restart = (includeDelay = true) => {
    //   tweenRef.current.invalidate();
    tweenRef.current?.restart(includeDelay);
  };

  const reverse = () => {
    tweenRef.current?.reverse();
  };

  useEffect(() => {
    if (eleRef.current) {
      const transformFrom = {
        toTop: `translate(0px, 100%)`,
        toBottom: `translate(0px, -100%)`,
        toLeft: `translate(100%, 0px)`,
        toRight: `translate(-100%, 0px)`,
      }[direction];

      tweenRef.current = gsap.fromTo(
        eleRef.current,
        {
          opacity: 0,
          transform: `${transformFrom} ${fixedTransform}`,
        },
        {
          opacity: 1,
          transform: `translate(0px, 0px) ${fixedTransform}`,
          duration,
          delay,
        }
      );
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [delay, direction, duration, eleRef, fixedTransform]);

  return { ref: eleRef, restart, reverse };
};

export default useMoveTo;
