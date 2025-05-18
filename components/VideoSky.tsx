"use client";

import * as THREE from "three";
import { useEffect, useState } from "react";
import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";

export default function VideoSky() {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const { screenSize, isLandscape } = useScreenSize();

  const shouldPrompt =
    (screenSize === "mobile" || screenSize === "tablet") && !isLandscape;

  useEffect(() => {
    const video = document.createElement("video");

    video.src = "https://miya-assets.b-cdn.net/skyloop.mp4";
    video.crossOrigin = "anonymous";
    video.autoplay = true;           // ✅ required on mobile
    video.muted = true;              // ✅ required on mobile
    video.playsInline = true;        // ✅ prevents fullscreen on iOS
    video.loop = true;               // ✅ keep looping
    video.load();

    // try playing early (some mobile browsers require this)
    video.play().catch((err) => {
      console.warn("Initial video.play() failed:", err);
    });

    video.addEventListener("canplay", () => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.needsUpdate = true;
      setTexture(videoTexture);
    });
  }, []);

  if (shouldPrompt) return <OrientationPrompt />;

  if (!texture) {
    // optional fallback for mobile
    return (
      <mesh position={[0, 2, -20]} rotation={[0, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshBasicMaterial color="#111" />
      </mesh>
    );
  }

  return (
    <mesh position={[0, 2, -20]} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 3]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
