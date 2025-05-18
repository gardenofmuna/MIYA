"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Loader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);

      if (width <= 600) setScreenSize("mobile");
      else if (width <= 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => setShow(false), 2000);
    }
  }, [progress]);

  if (!show) return null;

  const totalBars = 25;
  const filledBars = Math.round((progress / 100) * totalBars);

  // Responsive size based on device type (only when landscape)
  const width =
    !isLandscape ? 250 :
    screenSize === "mobile" ? 250 :
    screenSize === "tablet" ? 350 : 500;

  const fontSize =
    !isLandscape ? "10px" :
    screenSize === "mobile" ? "10px" :
    screenSize === "tablet" ? "11px" : "12px";

  const barHeight =
    !isLandscape ? 16 :
    screenSize === "mobile" ? 16 :
    screenSize === "tablet" ? 22 : 28;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        zIndex: 1000,
      }}
    >
      {/* 🔁 Rotation notice */}
      {!isLandscape && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "clamp(1rem, 4vw, 1.3rem)",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "1rem 2rem",
            borderRadius: "12px",
          }}
        >
          Please rotate your device to landscape
        </div>
      )}

      {/* 🔲 Loader bar */}
      {isLandscape && (
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: `${width}px`,
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize,
            }}
          >
            <span>LOADING...</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div
            style={{
              width: `${width}px`,
              height: `${barHeight}px`,
              border: "2px solid white",
              display: "flex",
              gap: "2px",
              padding: "2px",
              boxSizing: "border-box",
            }}
          >
            {Array.from({ length: totalBars }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i < filledBars ? "#fff" : "transparent",
                  border: "1px solid #fff",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
