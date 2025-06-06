"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import "@fontsource/homemade-apple";
import Image from "next/image";

type TextBox = {
  id: string;
  content: string;
};

export default function WritingCanvas() {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<"pen" | "eraser">("pen");
  const isDrawingRef = useRef(false);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");
  const [textBox, setTextBox] = useState<TextBox | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = mode === "pen" ? "/pen-32.png" : "/eraser-32.png";
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      canvas.style.cursor = `url(${url}) 0 32, auto`;
    };
  }, [mode]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastX = 0;
    let lastY = 0;

    const getCoords = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const touch = e.touches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      } else {
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    };

    const start = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const { x, y } = getCoords(e);
      lastX = x;
      lastY = y;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCoords(e);

      ctx.globalCompositeOperation =
        modeRef.current === "pen" ? "source-over" : "destination-out";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = modeRef.current === "pen" ? 2 : 20;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    };

    const stop = () => {
      isDrawingRef.current = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stop);
    canvas.addEventListener("touchcancel", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stop);
      canvas.removeEventListener("touchcancel", stop);
    };
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTextBox({ id: crypto.randomUUID(), content: "" });
  };

  const handleDownload = () => {
    if (!pageRef.current) return;
    toPng(pageRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "letter-full.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const handleAddTextBox = () => {
    if (!textBox) {
      setTextBox({ id: crypto.randomUUID(), content: "" });
    }
  };

  const updateTextBox = (content: string) => {
    if (textBox) setTextBox({ ...textBox, content });
  };

  return (
    <div
      ref={pageRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: "url('/wood-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Paper (Image) */}
      <Image
        src="/Page-4.png"
        alt="Paper"
        width={1920}
        height={1080}
        unoptimized
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vw",
          height: "auto",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2,
        }}
      />

      {/* Draggable Pen */}
      <motion.div
        drag
        dragMomentum={false}
        style={{
          position: "absolute",
          top: "22%",
          left: "65%",
          width: "60vw",
          zIndex: 3,
        }}
      >
        <Image
          src="/black-pen.png"
          alt="Pen"
          width={500}
          height={500}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            transform: "rotate(-45deg)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Text Box */}
      {textBox && (
        <textarea
          value={textBox.content}
          placeholder="Start writing..."
          onChange={(e) => updateTextBox(e.target.value)}
          onInput={(e) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          onMouseDown={(e) => {
            const el = e.currentTarget;
            const startX = e.clientX;
            const startY = e.clientY;
            const startTop = el.offsetTop;
            const startLeft = el.offsetLeft;

            const onMouseMove = (moveEvent: MouseEvent) => {
              el.style.top = `${startTop + (moveEvent.clientY - startY)}px`;
              el.style.left = `${startLeft + (moveEvent.clientX - startX)}px`;
            };

            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
            padding: "12px",
            border: "2px solid black",
            background: "transparent",
            color: "black",
            fontFamily: '"Homemade Apple", cursive',
            fontSize: "22px",
            minWidth: "200px",
            maxWidth: "70vw",
            resize: "both",
            overflow: "hidden",
            outline: "none",
          }}
        />
      )}

      {/* Toolbar */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "1.5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          zIndex: 5,
          background: "rgba(255, 255, 255, 0.85)",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <button onClick={() => setMode("pen")} style={{ background: "none", border: "none", textAlign: "center" }}>
          <div style={{ fontSize: "24px" }}>✏️</div>
          <div style={{ fontWeight: "bold", color: "black" }}>Pen</div>
        </button>
        <button onClick={() => setMode("eraser")} style={{ background: "none", border: "none", textAlign: "center" }}>
          <div style={{ fontSize: "24px" }}>🧽</div>
          <div style={{ fontWeight: "bold", color: "black" }}>Eraser</div>
        </button>
        <button onClick={handleClear} style={{ background: "none", border: "none", textAlign: "center" }}>
          <div style={{ fontSize: "24px" }}>🧼</div>
          <div style={{ fontWeight: "bold", color: "black" }}>Clear Page</div>
        </button>
        <button onClick={handleDownload} style={{ background: "none", border: "none", textAlign: "center" }}>
          <div style={{ fontSize: "24px" }}>📥</div>
          <div style={{ fontWeight: "bold", color: "black" }}>Download</div>
        </button>
        <button
          onClick={handleAddTextBox}
          disabled={!!textBox}
          style={{
            background: "none",
            border: "none",
            textAlign: "center",
            opacity: !!textBox ? 0.4 : 1,
          }}
        >
          <div style={{ fontSize: "24px" }}>➕</div>
          <div style={{ fontWeight: "bold", color: "black" }}>Add Text Box</div>
        </button>
      </div>
    </div>
  );
}
