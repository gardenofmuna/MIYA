"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import Hls from "hls.js";

export default function Loader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isLandscape, setIsLandscape] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);

      if (width <= 600) setScreenSize("mobile");
      else if (width <= 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 1500);
      setTimeout(() => setShow(false), 2000);
    }
  }, [progress]);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource("https://vz-67d4e9fb-0bc.b-cdn.net/55a1bd10-8a7e-4b8c-9f0a-569f1e46056c/playlist.m3u8");
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play();
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = "https://vz-67d4e9fb-0bc.b-cdn.net/55a1bd10-8a7e-4b8c-9f0a-569f1e46056c/playlist.m3u8";
        videoRef.current.addEventListener("loadedmetadata", () => {
          videoRef.current?.play();
        });
      }
    }
  }, []);

  if (!show) return null;

  const totalBars = 25;
  const filledBars = Math.round((progress / 100) * totalBars);

  const width =
    !isLandscape ? 250 :
    screenSize === "mobile" ? 250 :
    screenSize === "tablet" ? 350 : 500;

  const fontSize =
    !isLandscape ? "10px" :
    screenSize === "mobile" ? "10px" :
    screenSize === "tablet" ? "11px" : "12px";

  const barHeight =
    !isLandscape ? 16 :
    screenSize === "mobile" ? 16 :
    screenSize === "tablet" ? 22 : 28;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1000,
      }}
    >
      {/* 📽 Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* 🖤 Black Loader Overlay with 85% opacity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.5s ease-out",
          zIndex: 1,
        }}
      >
        {!isLandscape && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontSize: "clamp(1rem, 4vw, 1.3rem)",
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "1rem 2rem",
              borderRadius: "12px",
              zIndex: 2,
            }}
          >
            Please rotate your device to landscape
          </div>
        )}

        {isLandscape && (
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: `${width}px`,
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize,
              }}
            >
              <span>LOADING...</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div
              style={{
                width: `${width}px`,
                height: `${barHeight}px`,
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

            {/* 📝 Note about performance */}
            <p
              style={{
                marginTop: "1rem",
                fontSize: "10px",
                opacity: 0.8,
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              3D models may load slower on some computers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
