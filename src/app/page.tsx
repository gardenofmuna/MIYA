"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LottieIntroProps } from "../../components/LottieIntro";
import SceneCanvasWrapper from "../../components/SceneCanvasWrapper";

// Dynamic import for LottieIntro
const LottieIntro = dynamic<LottieIntroProps>(
  () => import("../../components/LottieIntro"),
  { ssr: false }
);

export default function HomePage() {
  const [showScene, setShowScene] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        position: "relative",
      }}
    >
      {showScene ? (
        <SceneCanvasWrapper />
      ) : (
        <LottieIntro onStart={() => setShowScene(true)} />
      )}
    </div>
  );
}
