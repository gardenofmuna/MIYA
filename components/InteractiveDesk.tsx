"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";
import styles from "./InteractiveDesk.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import Hls from "hls.js";

const hotspots = [
  {
    id: "Book1",
    src: "/Book1.png",
    overlay: "/To-Grandma.png",
    link: "/To-Grandma",
    top: "46.43%",
    left: "56.61%",
    width: "9.58%",
    height: "11.34%",
  },
  {
    id: "Book2",
    src: "/Book2.png",
    overlay: "/Forfatterinne i dag-Flora Nwapa (1987).png",
    link: "/Forfatterinne-i-dag-Flora-Nwapa-1987",
    top: "45.56%",
    left: "33.15%",
    width: "8.40%",
    height: "8.29%",
  },
  {
    id: "Book3",
    src: "/Book3.png",
    overlay: "/UofT1990.png",
    link: "/UofT-1990",
    top: "55.32%",
    left: "44.72%",
    width: "9.50%",
    height: "9.17%",
  },
  {
    id: "Speaker",
    src: "/Speaker.png",
    overlay: "/music.png",
    link: "/speaker",
    top: "22.64%",
    left: "91.93%",
    width: "5.94%",
    height: "6.25%",
  },
  {
    id: "AboutUs",
    src: "/About-Us.png",
    overlay: "/Flora-Amede-Zuru-Muna.png",
    link: "/about",
    top: "58.52%",
    left: "54.30%",
    width: "12.76%",
    height: "8.98%",
  },
  {
    id: "Letter",
    src: "/Letter.png",
    overlay: "/write-a-letter.png",
    link: "/letter",
    top: "54.49%",
    left: "31.09%",
    width: "11.82%",
    height: "15.56%",
  },
];

export default function InteractiveDesk() {
  const router = useRouter();
  const { screenSize, isLandscape } = useScreenSize();
  const [scale, setScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / 3840;
      const scaleY = window.innerHeight / 2160;
      setScale(Math.max(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // ✅ HLS video setup
  useEffect(() => {
    const video = videoRef.current;
    const src =
      "https://vz-67d4e9fb-0bc.b-cdn.net/1d87ef07-684d-4897-944c-d6ed79124b9a/playlist.m3u8";

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error);
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(console.error);
    }
  }, []);

  if (screenSize === "mobile" && !isLandscape) {
    return <OrientationPrompt />;
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5, ease: "easeOut" }}
    >
      <div
        className={styles.scene}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "3840px",
          height: "2160px",
        }}
      >
        {/* 🎥 Bunny HLS Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />

        {/* 📷 Optimized Static background image (WebP) */}
        <Image
          src="/background.webp"
          alt="Desk background"
          className={styles.bg}
          fill
          unoptimized
        />

        {/* 🎵 Music gif */}
        <Image
          src="/music.gif"
          alt="Music animation"
          className={styles.musicGif}
          width={100}
          height={100}
          unoptimized
        />

        {/* 📌 Interactive hotspots */}
        {hotspots.map(({ id, src, overlay, link, top, left, width, height }) => (
          <div
            key={id}
            className={styles.hotspotWrapper}
            style={{ top, left, width, height }}
            onClick={() => router.push(link)}
          >
            <Image
              src={src}
              alt={`${id} base`}
              className={styles.hotspotBase}
              fill
              unoptimized
            />
            <Image
              src={overlay}
              alt={`${id} overlay`}
              className={styles.hotspotOverlay}
              fill
              unoptimized
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
