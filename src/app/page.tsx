"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import InteractiveDesk from "../../components/InteractiveDesk";
import type { LottieIntroProps } from "../../components/LottieIntro";

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
        <InteractiveDesk /> // 👈 NEW COMPONENT HERE
      ) : (
        <LottieIntro onStart={() => setShowScene(true)} />
      )}
    </div>
  );
}
