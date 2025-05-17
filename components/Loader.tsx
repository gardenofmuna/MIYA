"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Loader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => setShow(false), 2000);
    }
  }, [progress]);

  if (!show) return null;

  const totalBars = 25;
  const filledBars = Math.round((progress / 100) * totalBars);

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
            width: "500px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            fontSize: "12px",
          }}
        >
          <span>LOADING...</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div
          style={{
            width: "500px",
            height: "28px",
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
    </div>
  );
}
