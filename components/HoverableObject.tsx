"use client";

import { useRouter } from "next/navigation";
import styles from "./InteractiveDesk.module.css";

const hotspots = [
  { id: "Book1", src: "/Book1.png", alt: "Book 1", link: "/book1" },
  { id: "Book2", src: "/Book2.png", alt: "Book 2", link: "/book2" },
  { id: "Book3", src: "/Book3.png", alt: "Book 3", link: "/book3" },
  { id: "Speaker", src: "/Speaker.png", alt: "Speaker", link: "/speaker" },
  { id: "AboutUs", src: "/About-Us.png", alt: "About Us", link: "/about" },
];

export default function InteractiveDesk() {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.scene}>
        <img
          src="/background.png"
          alt="Desk background"
          className={styles.layer}
        />

        {hotspots.map(({ id, src, alt, link }) => (
          <img
            key={id}
            src={src}
            alt={alt}
            className={`${styles.layer} ${styles.hotspot}`}
            onClick={() => router.push(link)}
          />
        ))}
      </div>
    </div>
  );
}
