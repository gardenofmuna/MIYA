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
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.load();

    video.addEventListener("canplay", () => {
      video.play();
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.needsUpdate = true;
      setTexture(videoTexture);
    });
  }, []);

  if (shouldPrompt) return <OrientationPrompt />;
  if (!texture) return null;

  return (
    <mesh position={[0, 2, -20]} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 3]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
