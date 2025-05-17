"use client";

import * as THREE from "three";
import { useEffect, useState } from "react";

export default function VideoPlane() {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/videos/skyloop.mp4";
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

  if (!texture) return null;

  return (
    <mesh position={[0, 2, -20]} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 3]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
