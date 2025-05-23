"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import Image from "next/image";

import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";

export default function CursorLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [angle, setAngle] = useState(0);

  const { screenSize, isLandscape } = useScreenSize();
  const shouldPrompt =
    (screenSize === "mobile" || screenSize === "tablet") && !isLandscape;

  const handleDrag = (_: unknown, info: PanInfo) => {
    const rotation = info.offset.x * 0.1 + info.offset.y * 0.1;
    setAngle(rotation);
  };

  useEffect(() => {
    let handlePointerMove: (e: PointerEvent) => void;

    import("lottie-web").then((lottieModule) => {
      const lottie = lottieModule.default;

      animationRef.current?.destroy();
      animationRef.current = null;

      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "canvas",
        loop: false,
        autoplay: false,
        path: "/lottie/work-animation.json",
      });

      animationRef.current = animation;

      handlePointerMove = (e: PointerEvent) => {
        if (!animationRef.current) return;

        let x = e.clientX;

        // Safe touch fallback without using `any`
        if (
          e.pointerType === "touch" &&
          (e as unknown as TouchEvent).touches?.[0]
        ) {
          x = (e as unknown as TouchEvent).touches[0].clientX;
        }

        const progress = x / window.innerWidth;
        animationRef.current.goToAndStop(
          progress * animationRef.current.totalFrames,
          true
        );
      };

      animation.addEventListener("DOMLoaded", () => {
        window.addEventListener("pointermove", handlePointerMove);
      });
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  if (shouldPrompt) {
    return <OrientationPrompt />;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Background Image */}
      <Image
        src="/images/wood-bg.png"
        alt="wood texture background"
        fill
        style={{
          objectFit: "cover",
          zIndex: 0,
        }}
        priority
      />

      {/* Draggable Lottie Layer */}
      <motion.div
        drag
        dragMomentum={false}
        onDrag={handleDrag}
        style={{
          x: dragX,
          y: dragY,
          rotateZ: angle,
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1,
          cursor: "grab",
          transition: "none",
          touchAction: "none",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      </motion.div>
    </div>
  );
}
