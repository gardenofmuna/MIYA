"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import InteractiveDesk from "../../components/InteractiveDesk";
import LoaderVideo from "../../components/LoaderVideo";

const LottieIntro = dynamic(
  () => import("../../components/LottieIntro"),
  { ssr: false }
);

export default function HomePage() {
  const [stage, setStage] = useState<"intro" | "loader" | "desk">("intro");

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
    

      {stage === "intro" && (
        <LottieIntro onStart={() => setStage("loader")} />
      )}

      {stage === "loader" && (
        <LoaderVideo onFinish={() => setStage("desk")} />
      )}

      {stage === "desk" && <InteractiveDesk />}
    </div>
  );
}
