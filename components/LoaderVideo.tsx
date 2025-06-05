"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Image from "next/image";

export default function LoaderVideo({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const hls = new Hls();
    const src = "https://vz-67d4e9fb-0bc.b-cdn.net/cfa4c13f-437e-450c-93a0-f905df2d754e/playlist.m3u8";

    const updateProgress = () => {
      if (video && video.duration > 0) {
        setProgress(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (video) setDuration(video.duration);
    };

    const handleEnded = () => {
      onFinish();
    };

    if (video) {
      video.muted = true;

      if (Hls.isSupported()) {
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(console.error);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.play().catch(console.error);
      }

      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      hls.destroy();
      video?.removeEventListener("ended", handleEnded);
      video?.removeEventListener("timeupdate", updateProgress);
      video?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onFinish]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const muted = !isMuted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }

    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!videoRef.current) return;

    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const percent = duration > 0 ? Math.round((progress / duration) * 100) : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* 🎥 Bunny HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 🔇 Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1001,
          background: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      {/* ▶️ Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <Image
          src={isPlaying ? "/pause.png" : "/play-button.png"}
          alt={isPlaying ? "Pause" : "Play"}
          width={80}
          height={80}
        />
      </button>

      {/* ⏳ % Display */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          color: "white",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "14px",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "4px 10px",
          borderRadius: "6px",
        }}
      >
        {percent}%
      </div>

      {/* 📶 Scrubbable Progress Bar */}
      <div
        onClick={handleScrub}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "4px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          zIndex: 1001,
          borderRadius: "2px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(progress / duration) * 100}%`,
            backgroundColor: "white",
            transition: "width 0.1s linear",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}
