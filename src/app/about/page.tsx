"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Html,
  Environment,
} from "@react-three/drei";
import {
  Group,
  VideoTexture,
  Mesh,
  BufferGeometry,
  Material,
  LoopOnce,
  LinearFilter,
  RGBFormat,
  SRGBColorSpace,
} from "three";
import { GLTF } from "three-stdlib";
import { Suspense, useRef, useEffect, useState } from "react";

import { useScreenSize } from "../../hooks/useScreenSize";
import OrientationPrompt from "../../../components/OrientationPrompt";

type GLTFResult = GLTF & {
  nodes: {
    VideoScreen_Object?: Mesh<BufferGeometry, Material | Material[]>;
    VHS_Tape?: Mesh;
  };
};

function TVScene({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const group = useRef<Group>(null);
  const { scene, animations, nodes } = useGLTF("/models/tv_vhs.glb") as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      const videoEl = videoRef.current;
      videoEl.crossOrigin = "anonymous";

      const handleCanPlay = () => {
        const tex = new VideoTexture(videoEl);
        tex.colorSpace = SRGBColorSpace;
        tex.needsUpdate = true;
        tex.minFilter = LinearFilter;
        tex.magFilter = LinearFilter;
        tex.format = RGBFormat;

        setVideoTexture(tex);
      };

      videoEl.addEventListener("canplay", handleCanPlay);
      return () => videoEl.removeEventListener("canplay", handleCanPlay);
    }
  }, [videoRef]);

  const handlePlay = () => {
    if (hasPlayed) return;

    const doorAction = actions["InsertDoor"];
    const tapeAction = actions["InsertTape"];

    if (doorAction && tapeAction) {
      doorAction.reset().setLoop(LoopOnce, 1).play();
      doorAction.clampWhenFinished = true;

      tapeAction.reset().setLoop(LoopOnce, 1).play();
      tapeAction.clampWhenFinished = true;
    }

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setHasPlayed(true);
          setShowButton(false);
        })
        .catch((err) => {
          console.warn("❌ Video play failed:", err);
        });
    }
  };

  return (
    <group ref={group} dispose={null} scale={[0.9, 0.9, 0.9]}>
      <primitive object={scene} />

      {nodes.VideoScreen_Object && (
        <mesh
          geometry={nodes.VideoScreen_Object.geometry}
          position={nodes.VideoScreen_Object.position}
          rotation={nodes.VideoScreen_Object.rotation}
          scale={nodes.VideoScreen_Object.scale}
        >
          <meshBasicMaterial map={videoTexture ?? null} toneMapped={false} />
        </mesh>
      )}

      {showButton && (
        <Html position={[0, 0.5, 1]} distanceFactor={5} center>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handlePlay}
              style={{
                background: "#000",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            >
              Insert VHS
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { screenSize, isLandscape } = useScreenSize();
  const shouldPrompt =
    (screenSize === "mobile" || screenSize === "tablet") && !isLandscape;

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  if (shouldPrompt) return <OrientationPrompt />;

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/vhs_clip.mp4"
        muted={isMuted}
        playsInline
        style={{ display: "none" }}
      />

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <button
          onClick={handleToggleMute}
          style={{
            background: "#000",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <div style={{ height: "100vh", background: "#2c2c2c" }}>
        <Canvas camera={{ position: [0, 2, 8], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <hemisphereLight
            color="#ffffff"
            groundColor="#222222"
            intensity={0.8}
          />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <TVScene videoRef={videoRef} />
          </Suspense>

          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </>
  );
}
