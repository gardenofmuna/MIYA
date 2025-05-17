"use client";

import dynamic from "next/dynamic";

// Dynamically import LottieIntro to prevent SSR issues
const LottieIntro = dynamic(() => import("../../components/LottieIntro"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <LottieIntro />
    </div>
  );
}
