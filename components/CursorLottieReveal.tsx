"use client";

import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

export default function CursorLottieReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/animations/deskReveal.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    animationRef.current = animation;

    const handleMouseMove = (e: MouseEvent) => {
      if (!animationRef.current) return;

      const { innerWidth } = window;
      const xPercent = e.clientX / innerWidth;
      const frame = Math.floor(xPercent * animationRef.current.totalFrames);
      animationRef.current.goToAndStop(frame, true);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      animation.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
