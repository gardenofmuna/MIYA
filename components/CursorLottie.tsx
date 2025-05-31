"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import Image from "next/image";

import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";

const imageSources = [
  { src: "/images/Page-1.png", alt: "page 1", top: "5%", left: "8%", rotate: -4 },
  { src: "/images/Page-2.png", alt: "page 2", top: "25%", left: "60%", rotate: 5 },
  { src: "/images/Page-3.png", alt: "page 3", top: "50%", left: "20%", rotate: -8 },
  { src: "/images/Page-4.png", alt: "page 4", top: "65%", left: "70%", rotate: 7 },
  { src: "/images/Muna.png", alt: "polaroid", top: "4%", left: "75%", rotate: 6 },
  { src: "/images/Tape-Recorder.png", alt: "tape recorder", top: "60%", left: "5%", rotate: -12 },
];

const getAspectRatio = (alt: string) => {
  if (alt === "polaroid") return 450 / 350;
  if (alt === "tape recorder") return 300 / 600; // adjust based on your image
  return 800 / 600;
};

export default function CursorLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [angle, setAngle] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  const { screenSize, isLandscape } = useScreenSize();
  const shouldPrompt =
    (screenSize === "mobile" || screenSize === "tablet") && !isLandscape;

  const handleDrag = (_: unknown, info: PanInfo) => {
    const rotation = info.offset.x * 0.1 + info.offset.y * 0.1;
    setAngle(rotation);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setShowPrompt(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

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
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          clearCanvas: true,
        },
      });

      animationRef.current = animation;

      handlePointerMove = (e: PointerEvent) => {
        if (!animationRef.current) return;

        let x = e.clientX;

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
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            fontWeight: 500,
            zIndex: 5,
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            pointerEvents: "none",
          }}
        >
          Try dragging the objects on the desk!
        </motion.div>
      )}

      <Image
        src="/images/wood-bg.png"
        alt="wood texture background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />

      {imageSources.map((img, idx) => {
        const aspectRatio = getAspectRatio(img.alt);
        const width = img.alt === "polaroid" ? "25vw" : "600px";
        const maxWidth = img.alt === "polaroid" ? "350px" : "90vw";

        return (
          <motion.div
            key={idx}
            drag
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 70, bounceDamping: 20 }}
            style={{
              position: "absolute",
              top: img.top,
              left: img.left,
              rotate: `${img.rotate}deg`,
              zIndex: 1,
              width,
              maxWidth,
              touchAction: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: `${aspectRatio * 100}%`,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{
                  objectFit: "contain",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                draggable={false}
              />
            </div>
          </motion.div>
        );
      })}

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
          zIndex: 2,
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
