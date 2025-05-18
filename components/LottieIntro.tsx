"use client";

import { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { motion } from "framer-motion";

export type LottieIntroProps = {
  onStart: () => void;
};

export default function LottieIntro({ onStart }: LottieIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const prevFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [started, setStarted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      setIsMobileOrTablet("ontouchstart" in window && window.innerWidth <= 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkDeviceAndOrientation();
    window.addEventListener("resize", checkDeviceAndOrientation);
    return () => window.removeEventListener("resize", checkDeviceAndOrientation);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isLandscape) return;

    audioRef.current = new Audio("/sounds/paper-sweep.mp3");
    audioRef.current.volume = 0.8;

    const container = containerRef.current;
    container.innerHTML = "";

    const animation = lottie.loadAnimation({
      container,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      path: "/animations/intro.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        clearCanvas: true,
      },
    });

    animationRef.current = animation;

    let resizeObserver: ResizeObserver | null = null;

    animation.addEventListener("DOMLoaded", () => {
      animation.goToAndStop(0, true);
      prevFrameRef.current = 0;

      resizeObserver = new ResizeObserver(() => {
        animationRef.current?.resize?.();
      });

      resizeObserver.observe(container);
    });

    const handleFrameChange = (x: number) => {
      if (!animationRef.current) return;
      const totalFrames = animationRef.current.totalFrames;
      const progress = x / window.innerWidth;
      const currentFrame = Math.floor(progress * totalFrames);
      animationRef.current.goToAndStop(currentFrame, true);
      triggerAudio(currentFrame, totalFrames);
    };

    const triggerAudio = (current: number, total: number) => {
      prevFrameRef.current = current;
      const atStart = current === 0;
      const atEnd = current === total - 1;

      if (audioEnabled && audioRef.current && (atStart || atEnd)) {
        console.log("🔊 Triggering sound at frame", current);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn("🔇 Audio play failed:", err);
        });
      }
    };

    const handleTouchStart = () => {
      if (!audioEnabled) {
        setAudioEnabled(true);
        setShowPrompt(false);

        audioRef.current?.play().catch((err) => {
          console.warn("🔇 Audio play blocked on touchstart:", err);
        });
      }
    };

    window.addEventListener("mousemove", (e) => handleFrameChange(e.clientX));
    window.addEventListener("touchmove", (e) => handleFrameChange(e.touches[0].clientX));
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        setAudioEnabled(true);
        setShowPrompt(false);

        audioRef.current?.play().catch((err) => {
          console.warn("🔇 Audio play blocked on spacebar:", err);
        });
      }
    });
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousemove", (e) => handleFrameChange(e.clientX));
      window.removeEventListener("touchmove", (e) => handleFrameChange(e.touches[0].clientX));
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("touchstart", handleTouchStart);
      animation.destroy();
      resizeObserver?.disconnect();
    };
  }, [audioEnabled, isLandscape]);

  useEffect(() => {
    if (started) onStart();
  }, [started, onStart]);

  if (started) return null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {/* 🪵 Background */}
      <div
        style={{
          backgroundImage: "url('/images/wood-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* 🔁 Orientation prompt */}
      {!isLandscape && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "clamp(1rem, 4vw, 1.5rem)",
            fontWeight: 600,
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "1rem 2rem",
            borderRadius: "12px",
            zIndex: 10,
          }}
        >
          Please rotate your device to landscape
        </motion.div>
      )}

      {/* 📣 Prompt */}
      {showPrompt && isLandscape && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "10%",
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
          }}
        >
          {isMobileOrTablet
            ? "Tap screen to enable sound\nand swipe to interact"
            : "Press space bar to enable sound\nand move cursor"}
        </motion.div>
      )}

      {/* 🟦 Start Button */}
      {isLandscape && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <motion.img
            src="/start.png"
            alt="Start"
            onClick={() => {
              if (
                isMobileOrTablet &&
                document.documentElement.requestFullscreen
              ) {
                document.documentElement.requestFullscreen().catch(console.warn);
              }

              setAudioEnabled(true);
              setShowPrompt(false);

              audioRef.current?.play().catch((err) => {
                console.warn("🔇 Audio play blocked on start button:", err);
              });

              setStarted(true);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "30vw",
              maxWidth: "180px",
              minWidth: "100px",
              height: "auto",
              cursor: "pointer",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* 🎞️ Lottie Canvas */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
