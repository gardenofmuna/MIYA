"use client";
import { useEffect, useRef } from "react";

export default function CursorScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef<number>(1); // Fallback duration

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = (e: MouseEvent) => {
      if (!durationRef.current) return;
      const x = e.clientX / window.innerWidth;
      video.currentTime = x * durationRef.current;
    };

    const handleLoaded = () => {
      if (video.duration) {
        durationRef.current = video.duration;
        video.pause();
      }
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    window.addEventListener("mousemove", updateTime);

    return () => {
      window.removeEventListener("mousemove", updateTime);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/videos/work-animation.webm"
      playsInline
      muted
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        background: "transparent",
        pointerEvents: "none",
      }}
    />
  );
}
