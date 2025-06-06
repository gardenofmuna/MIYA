"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./MenuOverlay.module.css";
import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";

export default function MenuOverlay() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLandscape } = useScreenSize();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Disable menu completely if portrait
  if (!isLandscape) return <OrientationPrompt />;

  const spineMenu = [
    {
      src: "/To-Grandma.webp",
      alt: "To Grandma",
      route: "/To-Grandma",
      label: "Letters to Mama",
      top: "51.8vh",
      left: "0vw",
      width: "38vw",
      height: "4.4vh",
    },
    {
      src: "/Forfatterinne-i-dag-Flora-Nwapa-1987.webp",
      alt: "NRK Documentary",
      route: "/Forfatterinne-i-dag-Flora-Nwapa-1987",
      label: "NRK Documentary",
      top: "56.1vh",
      left: "0vw",
      width: "39.3vw",
      height: "10.1vh",
    },
    {
      src: "/UofT-1990.webp",
      alt: "U of T 1990",
      route: "/UofT-1990",
      label: "U of T 1990",
      top: "66.2vh",
      left: "0vw",
      width: "42.1vw",
      height: "10.6vh",
    },
    {
      src: "/Letter.webp",
      alt: "Write a Letter",
      route: "/letter",
      label: "Write a Letter to Someone",
      top: "76.8vh",
      left: "0vw",
      width: "43.1vw",
      height: "5.1vh",
    },
    {
      src: "/Flora-Zuru-Muna.webp",
      alt: "About Us",
      route: "/Flora-Zuru-Muna-Amede",
      label: "About Us",
      top: "81.9vh",
      left: "0vw",
      width: "50vw",
      height: "18.3vh",
    },
  ];

  return (
    <div
      className={styles.menuContainer}
      style={{ pointerEvents: menuOpen ? "auto" : "none" }}
    >
      {/* Menu Icon */}
      <Image
        src="/three_spines_menu_icon.webp"
        alt="Menu"
        width={48}
        height={48}
        className={styles.menuIcon}
        onClick={() => setMenuOpen(prev => !prev)}
      />

      {/* Black overlay */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Spines */}
      {menuOpen &&
        spineMenu.map((item) => (
          <div
            key={item.src}
            className={styles.spine}
            style={{
              top: item.top,
              left: item.left,
              width: item.width,
              height: item.height,
            }}
            onClick={() => {
              setMenuOpen(false);
              router.push(item.route);
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              style={{ objectFit: "cover" }}
            />
            <div className={styles.speechBubble}>{item.label}</div>
          </div>
        ))}
    </div>
  );
}
