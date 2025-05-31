"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";
import styles from "./InteractiveDesk.module.css";

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

  if (screenSize === "mobile" && !isLandscape) {
    return <OrientationPrompt />;
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.scene}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "3840px",
          height: "2160px",
        }}
      >
        {/* 🎥 Video window, behind background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.video}
          src="https://miya-assets.b-cdn.net/skyloop.mp4"
        />

        {/* 📷 Background image above video */}
        <img src="/background.png" alt="Desk background" className={styles.bg} />

        {/* 📌 Hoverable hotspots with overlays */}
        {hotspots.map(({ id, src, overlay, link, top, left, width, height }) => (
          <div
            key={id}
            className={styles.hotspotWrapper}
            style={{ top, left, width, height }}
            onClick={() => router.push(link)}
          >
            <img src={src} className={styles.hotspotBase} />
            <img src={overlay} className={styles.hotspotOverlay} />
          </div>
        ))}
      </div>
    </div>
  );
}
