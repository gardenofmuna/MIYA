"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import Image from "next/image";

const sceneImages: Record<string, any[]> = {
  muna: [
    { src: "/images/Grandma-side-profile.png", alt: "grandma", top: "5%", left: "5%", rotate: -6 },
    { src: "/images/Page-1.png", alt: "page 1", top: "5%", left: "8%", rotate: -4 },
    { src: "/images/Page-2.png", alt: "page 2", top: "25%", left: "60%", rotate: 5 },
    { src: "/images/Page-3.png", alt: "page 3", top: "50%", left: "20%", rotate: -8 },
    { src: "/images/Page-4.png", alt: "page 4", top: "65%", left: "70%", rotate: 7 },
    { src: "/images/Muna.png", alt: "polaroid", top: "4%", left: "75%", rotate: 6 },
    { src: "/images/Tape-Recorder.png", alt: "tape recorder", top: "60%", left: "5%", rotate: -12 },
  ],
  zuru: [
    { src: "/images/Mama.png", alt: "mama", top: "5%", left: "5%", rotate: -6 },
    { src: "/images/Zuru-Letter1.png", alt: "letter1", top: "5%", left: "8%", rotate: -4 },
    { src: "/images/Zuru-Letter2.png", alt: "letter2", top: "25%", left: "60%", rotate: 5 },
    { src: "/images/Zuru-Letter3.png", alt: "letter3", top: "50%", left: "20%", rotate: -8 },
    { src: "/images/Zuru.png", alt: "polaroid", top: "4%", left: "75%", rotate: 6 },
    { src: "/images/Tape-Recorder.png", alt: "tape recorder", top: "60%", left: "5%", rotate: -12 },
  ],
  mum: [
    { src: "/grandma-passport.png", alt: "passport", top: "2%", left: "2%", rotate: -4, width: "16vw" },
    { src: "/grandma-polaroid.png", alt: "polaroid", top: "12%", left: "22%", rotate: 4 },
    { src: "/Uzoma-graduation.png", alt: "grad", top: "60%", left: "5%", rotate: -3 },
    { src: "/mum_grandma.png", alt: "mum+grandma", top: "35%", left: "60%", rotate: -6 },
    { src: "/Mum_trad.png", alt: "trad", top: "5%", left: "70%", rotate: 5 },
    { src: "/Mum_car.png", alt: "car", top: "70%", left: "35%", rotate: 2 },
    { src: "/Mum-lawschool.png", alt: "lawschool", top: "25%", left: "5%", rotate: -2 },
    { src: "/Mum-wedding1.png", alt: "wedding1", top: "15%", left: "40%", rotate: 1 },
    { src: "/Mum-wedding2.png", alt: "wedding2", top: "50%", left: "75%", rotate: 3 },
    { src: "/Note_iphone_Letter.png", alt: "iphone-note", top: "20%", left: "30%", rotate: 0, width: "30vw" },
  ],
};

const getAspectRatio = (alt: string) => {
  if (alt === "polaroid") return 450 / 350;
  if (alt === "tape recorder") return 300 / 600;
  if (alt === "grandma" || alt === "mama") return 987 / 768;
  return 800 / 600;
};

export default function ToGrandmaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentScene, setCurrentScene] = useState<"muna" | "zuru" | "mum">("muna");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [hasDragged, setHasDragged] = useState(false);
  const [userManuallySwitched, setUserManuallySwitched] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [angle, setAngle] = useState(0);

  const getNextScene = (scene: typeof currentScene) => {
    if (scene === "muna") return "zuru";
    if (scene === "zuru") return "mum";
    return "mum";
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSceneChange = (target: "muna" | "zuru" | "mum") => {
    setDirection(target === "muna" ? "backward" : "forward");
    setCurrentScene(target);
    setUserManuallySwitched(true);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    const rotation = info.offset.x * 0.1 + info.offset.y * 0.1;
    setAngle(rotation);
    if (!hasDragged) {
      setHasDragged(true);
      setShowPrompt(false);
    }
  };

  useEffect(() => {
    import("lottie-web").then((lottieModule) => {
      const lottie = lottieModule.default;
      animationRef.current?.destroy();
      animationRef.current = null;

      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "canvas",
        loop: false,
        autoplay: false,
        path: "/lottie/work-animation.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          clearCanvas: true,
        },
      });

      animationRef.current = animation;

      const handlePointerMove = (e: PointerEvent) => {
        if (!animationRef.current) return;
        let x = e.clientX;
        if (e.pointerType === "touch" && (e as PointerEvent & TouchEvent).touches?.[0]) {
          x = (e as PointerEvent & TouchEvent).touches[0].clientX;
        }
        const progress = x / window.innerWidth;
        animationRef.current.goToAndStop(progress * animationRef.current.totalFrames, true);
      };

      animation.addEventListener("DOMLoaded", () => {
        window.addEventListener("pointermove", handlePointerMove);
      });

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        animationRef.current?.destroy();
      };
    });
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src =
      currentScene === "muna"
        ? "/Muna%20letter.mp3"
        : currentScene === "zuru"
        ? "/ZURU-NARRATION.mp3"
        : "/MUM-NARRATION-igbo.mp3";
    audioRef.current.load();
    setIsPlaying(false);
    setUserManuallySwitched(false);

    const onEnded = () => {
      if (!userManuallySwitched) {
        const next = getNextScene(currentScene);
        if (currentScene !== next) {
          handleSceneChange(next);
        }
      }
    };

    audioRef.current.addEventListener("ended", onEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", onEnded);
    };
  }, [currentScene]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <audio ref={audioRef} preload="auto" />
      <Image src="/images/wood-bg.png" alt="wood background" fill style={{ objectFit: "cover", zIndex: 0 }} priority />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ x: direction === "forward" ? 1000 : -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "forward" ? -1000 : 1000, opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 3 }}
        >
          {sceneImages[currentScene].map((img, idx) => {
            const aspectRatio = getAspectRatio(img.alt);
            const width = img.width || (img.alt === "polaroid" ? "25vw" : "600px");
            const maxWidth = "90vw";

            return (
              <motion.div
                key={idx}
                drag
                dragMomentum={false}
                dragTransition={{ bounceStiffness: 70, bounceDamping: 20 }}
                onDrag={handleDrag}
                style={{
                  position: "absolute",
                  top: img.top,
                  left: img.left,
                  rotate: `${img.rotate}deg`,
                  zIndex: img.alt === "iphone-note" ? 100 : 1,
                  width,
                  maxWidth,
                  touchAction: "none",
                }}
              >
                <div style={{ position: "relative", width: "100%", paddingBottom: `${aspectRatio * 100}%` }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    style={{ objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
                    draggable={false}
                  />
                </div>
              </motion.div>
            );
          })}

          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "3%",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                fontWeight: 500,
                zIndex: 5,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                pointerEvents: "none",
              }}
            >
              Drag objects around the scene & press play to listen to the letters.
            </motion.div>
          )}

          <motion.img
            src="/images/play-pause.png"
            alt="Play/Pause"
            onClick={toggleAudio}
            animate={!isPlaying ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
            transition={!isPlaying ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            style={{
              position: "fixed",
              top: "2%",
              right: "2%",
              width: "60px",
              height: "60px",
              cursor: "pointer",
              zIndex: 100,
            }}
          />

          {currentScene === "muna" && (
            <motion.img
              src="/Zuru-Letter-Button.png"
              alt="Next: Zuru's Letter"
              onClick={() => handleSceneChange("zuru")}
              whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ position: "absolute", bottom: "3%", right: "3%", width: "180px", cursor: "pointer", zIndex: 10 }}
            />
          )}

          {currentScene === "zuru" && (
            <>
              <motion.img
                src="/Muna-Letter-Button.png"
                alt="Back to Muna"
                onClick={() => handleSceneChange("muna")}
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{ position: "absolute", bottom: "3%", left: "3%", width: "180px", cursor: "pointer", zIndex: 10 }}
              />
              <motion.img
                src="/Mum-Letter-Button.png"
                alt="Forward to Mum"
                onClick={() => handleSceneChange("mum")}
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{ position: "absolute", bottom: "3%", right: "3%", width: "180px", cursor: "pointer", zIndex: 10 }}
              />
            </>
          )}

          {currentScene === "mum" && (
            <motion.img
              src="/Zuru-Letter-Button-previous.png"
              alt="Back to Zuru"
              onClick={() => handleSceneChange("zuru")}
              whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ position: "absolute", bottom: "3%", left: "3%", width: "180px", cursor: "pointer", zIndex: 10 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        drag
        dragMomentum={false}
        onDrag={handleDrag}
        style={{
          x: dragX,
          y: dragY,
          rotateZ: angle,
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 5,
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
      </motion.div>
    </div>
  );
}
