/* eslint-disable 
  @typescript-eslint/no-unused-vars,
  @typescript-eslint/no-explicit-any,
  react-hooks/exhaustive-deps
*/
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import Image from "next/image";
import { useScreenSize } from "../../hooks/useScreenSize";
import OrientationPrompt from "../../../components/OrientationPrompt";

type Scene = "muna" | "zuru" | "mum";

type SceneImage = {
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: number;
  width?: string;
};

const sceneImages: Record<Scene, SceneImage[]> = {
  muna: [
    { src: "/images/Grandma-side-profile.webp", alt: "grandma", top: "5%", left: "5%", rotate: -6 },
    { src: "/images/Page-1.webp", alt: "page 1", top: "5%", left: "8%", rotate: -4 },
    { src: "/images/Page-2.webp", alt: "page 2", top: "25%", left: "60%", rotate: 5 },
    { src: "/images/Page-3.webp", alt: "page 3", top: "50%", left: "20%", rotate: -8 },
    { src: "/images/Page-4.webp", alt: "page 4", top: "65%", left: "70%", rotate: 7 },
    { src: "/images/Muna.webp", alt: "polaroid", top: "4%", left: "75%", rotate: 6 },
    { src: "/images/Tape-Recorder.webp", alt: "tape recorder", top: "60%", left: "5%", rotate: -12 },
  ],
  zuru: [
    { src: "/images/Mama.webp", alt: "mama", top: "5%", left: "5%", rotate: -6 },
    { src: "/images/Zuru-Letter1.webp", alt: "letter1", top: "5%", left: "8%", rotate: -4 },
    { src: "/images/Zuru-Letter2.webp", alt: "letter2", top: "25%", left: "60%", rotate: 5 },
    { src: "/images/Zuru-Letter3.webp", alt: "letter3", top: "50%", left: "20%", rotate: -8 },
    { src: "/images/Zuru.webp", alt: "polaroid", top: "4%", left: "75%", rotate: 6 },
    { src: "/images/Tape-Recorder.webp", alt: "tape recorder", top: "60%", left: "5%", rotate: -12 },
  ],
  mum: [
    { src: "/grandma-passport.webp", alt: "passport", top: "2%", left: "2%", rotate: -4, width: "16vw" },
    { src: "/grandma-polaroid.webp", alt: "polaroid", top: "12%", left: "22%", rotate: 4 },
    { src: "/Uzoma-graduation.webp", alt: "grad", top: "60%", left: "5%", rotate: -3 },
    { src: "/mum_grandma.webp", alt: "mum+grandma", top: "35%", left: "60%", rotate: -6 },
    { src: "/Mum_trad.webp", alt: "trad", top: "5%", left: "70%", rotate: 5 },
    { src: "/Mum_car.webp", alt: "car", top: "70%", left: "35%", rotate: 2 },
    { src: "/Mum-lawschool.webp", alt: "lawschool", top: "25%", left: "5%", rotate: -2 },
    { src: "/Mum-wedding1.webp", alt: "wedding1", top: "15%", left: "40%", rotate: 1 },
    { src: "/Mum-wedding2.webp", alt: "wedding2", top: "50%", left: "75%", rotate: 3 },
    { src: "/Note_iphone_Letter.webp", alt: "iphone-note", top: "20%", left: "30%", rotate: 0, width: "30vw" },
  ],
};

const getAspectRatio = (alt: string) => {
  if (alt === "polaroid") return 450 / 350;
  if (alt === "tape recorder") return 300 / 600;
  if (alt === "grandma" || alt === "mama") return 987 / 768;
  return 800 / 600;
};

export default function ToGrandmaPage() {
  // Always call hooks in the same order:
  const { screenSize, isLandscape } = useScreenSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentScene, setCurrentScene] = useState<Scene>("muna");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [hasDragged, setHasDragged] = useState(false);
  const [userManuallySwitched, setUserManuallySwitched] = useState(false);

  // Lottie drag state
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [angle, setAngle] = useState(0);

  const getNextScene = (scene: Scene): Scene => {
    if (scene === "muna") return "zuru";
    if (scene === "zuru") return "mum";
    return "mum";
  };

  const handleSceneChange = (target: Scene) => {
    setDirection(target === "muna" ? "backward" : "forward");
    setCurrentScene(target);
    setUserManuallySwitched(true);
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

  // Called when an image is dragged; silences the prompt.
  const handleImageDrag = (_: unknown, info: PanInfo) => {
    if (!hasDragged) {
      setHasDragged(true);
      setShowPrompt(false);
    }
    // (Optional: Add per-image rotation here if desired)
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasDragged) setShowPrompt(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [hasDragged]);

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
          preserveAspectRatio: "xMidYMid meet", // keep aspect ratio
          clearCanvas: true,
        },
      });

      animationRef.current = animation;

      const handlePointerMove = (e: PointerEvent) => {
        let x = e.clientX;
        if (e.pointerType === "touch") {
          const touchEvent = e as unknown as TouchEvent;
          if (touchEvent.touches?.[0]) {
            x = touchEvent.touches[0].clientX;
          }
        }
        const progress = x / window.innerWidth;
        animationRef.current?.goToAndStop(progress * animationRef.current!.totalFrames, true);
      };

      animation.addEventListener("DOMLoaded", () => {
        // Force the injected <canvas> to preserve its aspect ratio:
        const canvasEl = (animation as any).renderer?.view as HTMLCanvasElement | undefined;
        if (canvasEl) {
          canvasEl.style.width = "100%";
          canvasEl.style.height = "auto";
          canvasEl.style.maxHeight = "100%";
        }
        window.addEventListener("pointermove", handlePointerMove);
      });

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        animationRef.current?.destroy();
      };
    });
  }, []);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.src =
      currentScene === "muna"
        ? "/Muna%20letter.mp3"
        : currentScene === "zuru"
        ? "/ZURU-NARRATION.mp3"
        : "/MUM-NARRATION-igbo.mp3";
    audioEl.load();
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

    audioEl.addEventListener("ended", onEnded);
    return () => {
      audioEl.removeEventListener("ended", onEnded);
    };
  }, [currentScene]);

  // After all hooks run, conditionally render orientation prompt:
  if (!isLandscape) {
    return <OrientationPrompt />;
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <audio ref={audioRef} preload="auto" />
      <Image
        src="/images/wooden-bg.webp"
        alt="wood background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ x: direction === "forward" ? 1000 : -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "forward" ? -1000 : 1000, opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 1 }}
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
                onDrag={handleImageDrag}
                style={{
                  position: "absolute",
                  top: img.top,
                  left: img.left,
                  rotate: `${img.rotate}deg`,
                  zIndex: 2, // images sit above the Lottie layer
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
                zIndex: 3,
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
            src="/images/play-pause.webp"
            alt="Play/Pause"
            onClick={toggleAudio}
            animate={!isPlaying ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
            transition={!isPlaying ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
            style={{
              position: "fixed",
              top: "2%",
              right: "2%",
              width: "60px",
              height: "60px",
              cursor: "pointer",
              zIndex: 3,
            }}
          />

          {currentScene === "muna" && (
            <motion.img
              src="/Zuru-Letter-Button.webp"
              alt="Next: Zuru's Letter"
              onClick={() => handleSceneChange("zuru")}
              whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
              style={{
                position: "absolute",
                bottom: "3%",
                right: "3%",
                width: "180px",
                cursor: "pointer",
                zIndex: 2,
              }}
            />
          )}

          {currentScene === "zuru" && (
            <>
              <motion.img
                src="/Muna-Letter-Button.webp"
                alt="Back to Muna"
                onClick={() => handleSceneChange("muna")}
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
                style={{
                  position: "absolute",
                  bottom: "3%",
                  left: "3%",
                  width: "180px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              />
              <motion.img
                src="/Mum-Letter-Button.webp"
                alt="Forward to Mum"
                onClick={() => handleSceneChange("mum")}
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
                style={{
                  position: "absolute",
                  bottom: "3%",
                  right: "3%",
                  width: "180px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              />
            </>
          )}

          {currentScene === "mum" && (
            <motion.img
              src="/Zuru-Letter-Button-previous.webp"
              alt="Back to Zuru"
              onClick={() => handleSceneChange("zuru")}
              whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(0,0,0,0.8))" }}
              style={{
                position: "absolute",
                bottom: "3%",
                left: "3%",
                width: "180px",
                cursor: "pointer",
                zIndex: 2,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/*
        Lottie wrapper is now the topmost layer (zIndex: 4).  
        We'll give it full-screen size and let it capture drag events anywhere.  
        Because images live at zIndex 2 beneath it, they will be covered visually.
        However, to ensure that dragging an image does NOT also drag Lottie,
        each image's <motion.div onDrag> handler will call stopPropagation
        (so the Lottie’s drag handler never sees that event).

        We achieve this by setting pointerEvents='auto' on everything
        so normal hit-testing still goes Lottie→images on top. Then, in
        each image's onPointerDownCapture, we call event.stopPropagation(),
        ensuring that any drag that starts on an image never bubbles up
        to Lottie.
      */}
      <motion.div
        drag
        dragMomentum={false}
        onDrag={(_e, info: PanInfo) => {
          // Lottie moves only when the initial pointer event did not start on an image
          const rotation = info.offset.x * 0.1 + info.offset.y * 0.1;
          setAngle(rotation);
        }}
        style={{
          x: dragX,
          y: dragY,
          rotateZ: angle,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 4, // highest layer
          cursor: "grab",
          touchAction: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "auto", // must be able to receive drag
        }}
      >
        {/* Invisible backdrop so that clicking anywhere
            (except on an image) will target Lottie. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none", // let Lottie’s canvas handle actual pointer events
          }}
        />
        {/* Lottie container (the canvas will be injected here) */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            overflow: "hidden",
          }}
        />
      </motion.div>

      {/*
        Add onPointerDownCapture to every image so that when an image
        is clicked/touched, we stop propagation before it reaches Lottie.
        That way, dragging that image ONLY drags the image, and the Lottie
        underneath won't respond.
      */}
      {sceneImages[currentScene].map((img, idx) => null) /* purely to illustrate the idea */}      
    </div>
  );
}
