"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import lottie, { AnimationItem } from "lottie-web";
import { motion } from "framer-motion";

// Load SceneCanvas after intro
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function LottieIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const prevFrameRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup sweep sound
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
      },
    });

    animationRef.current = animation;

    animation.addEventListener("DOMLoaded", () => {
      animation.goToAndStop(0, true);
      prevFrameRef.current = 0;
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!animationRef.current) return;

      const totalFrames = animationRef.current.totalFrames;
      const progress = e.clientX / window.innerWidth;
      const currentFrame = Math.floor(progress * totalFrames);
      animationRef.current.goToAndStop(currentFrame, true);

      const prevFrame = prevFrameRef.current;
      prevFrameRef.current = currentFrame;

      // 🔊 Play at start or end
      if (audioEnabled && audioRef.current) {
        if (
          (prevFrame !== 0 && currentFrame === 0) ||
          (prevFrame !== totalFrames - 1 && currentFrame === totalFrames - 1)
        ) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => {
            console.warn("Audio play failed:", err);
          });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setAudioEnabled(true);
        setShowPrompt(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      animation.destroy();
    };
  }, [audioEnabled]);

  if (started) return <SceneCanvas />;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
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

      {/* 📣 Instructional Prompt */}
      {showPrompt && (
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
            fontSize: "1.2rem",
            fontWeight: 500,
            zIndex: 5,
            textAlign: "center",
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "8px",
          }}
        >
          Press space bar to enable sound<br />and then move cursor
        </motion.div>
      )}

      {/* 🟦 Centered Start Button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          paddingLeft: "8px",
        }}
      >
        <motion.img
          src="/start.png"
          alt="Start"
          onClick={() => setStarted(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "180px",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>

      {/* 🎞️ Lottie Animation Layer */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
