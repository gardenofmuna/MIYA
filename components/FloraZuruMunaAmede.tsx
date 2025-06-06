"use client";

import { useEffect, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import Image from "next/image";
import styles from "./FloraZuruMunaAmede.module.css";
import { useScreenSize } from "../src/hooks/useScreenSize";
import OrientationPrompt from "./OrientationPrompt";

const bios = [
  {
    id: "Amede",
    cover: "/images/bios/Amede-bio-cover.webp",
    bio: "/images/bios/Amede-bio.webp",
    alt: "Amede Nzeribe bio",
    top: "8%",
    left: "8%",
    rotate: -5,
    width: "800px",
  },
  {
    id: "Zuru",
    cover: "/images/bios/Zuru-bio-cover.webp",
    bio: "/images/bios/Zuru-bio.webp",
    alt: "Zuru bio",
    top: "8%",
    left: "60%",
    rotate: 4,
    width: "600px",
  },
  {
    id: "Muna",
    cover: "/images/bios/Muna-bio-cover.webp",
    bio: "/images/bios/Muna-bio.webp",
    alt: "Muna Nzeribe bio",
    top: "10%",
    left: "8%",
    rotate: -7,
    width: "800px",
  },
  {
    id: "Efuru",
    cover: "/images/bios/Efuru-bio-cover.webp",
    bio: "/images/bios/Flora-bio.webp",
    alt: "Flora Nwapa bio",
    top: "5%",
    left: "20%",
    rotate: 7,
    width: "800px",
  },
];

export default function FloraZuruMunaAmede() {
  const { isLandscape } = useScreenSize();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasDragged(true), 10000);
    return () => clearTimeout(timeout);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDrag = (_: unknown, _info: PanInfo) => {
    if (!hasDragged) {
      setHasDragged(true);
    }
  };

  if (!isLandscape) {
    return <OrientationPrompt />;
  }

  return (
    <div className={styles.container}>
      {!hasDragged && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={styles.dragPrompt}
        >
          Drag any image around the page.
        </motion.div>
      )}

      {bios.map(({ id, cover, bio, alt, top, left, rotate, width }) => (
        <motion.div
          key={id}
          className={styles.imageWrapper}
          style={{ top, left, rotate: `${rotate}deg`, width }}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
          drag
          dragMomentum={false}
          onDrag={handleDrag}
        >
          <div style={{ position: "relative", width: "100%", paddingBottom: "125%" }}>
            <Image
              src={hoveredId === id ? bio : cover}
              alt={alt}
              fill
              style={{ objectFit: "contain", pointerEvents: "none" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
