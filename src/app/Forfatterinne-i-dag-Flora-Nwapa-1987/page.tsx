"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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
  DoubleSide,
  ClampToEdgeWrapping,
} from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { GLTF } from "three-stdlib";
import { Suspense, useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import Image from "next/image";

import { useScreenSize } from "../../hooks/useScreenSize";
import OrientationPrompt from "../../../components/OrientationPrompt";
import Loader from "../../../components/Loader";

// Define GLTF type
type GLTFResult = GLTF & {
  nodes: {
    VideoScreen_Object?: Mesh<BufferGeometry, Material | Material[]>;
    VHS_Tape?: Mesh;
    Wall_Left?: Mesh<BufferGeometry, Material | Material[]>;
  };
};

// TV Scene
function TVScene({
  videoRef,
  onLoaded,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  onLoaded: () => void;
}) {
  const group = useRef<Group>(null);
  const { scene, animations, nodes } = useGLTF("https://miya-assets.b-cdn.net/TV2.glb") as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (scene) onLoaded();
  }, [scene, onLoaded]);

  useFrame(() => {
    if (videoTexture) videoTexture.needsUpdate = true;
  });

  const handlePlay = () => {
    if (hasPlayed || !videoRef.current) return;

    const video = videoRef.current;
    video.crossOrigin = "anonymous";

    video
      .play()
      .then(() => {
        const tex = new VideoTexture(video);
        tex.colorSpace = SRGBColorSpace;
        tex.minFilter = LinearFilter;
        tex.magFilter = LinearFilter;
        tex.format = RGBFormat;
        tex.repeat.set(-2.0, 2.0);
        tex.offset.set(1.5, -0.5);
        tex.wrapS = tex.wrapT = ClampToEdgeWrapping;

        setVideoTexture(tex);
        setHasPlayed(true);
        setShowButton(false);

        const doorAction = actions["InsertDoor"];
        const tapeAction = actions["InsertTape"];

        doorAction?.reset().setLoop(LoopOnce, 1).play();
        doorAction!.clampWhenFinished = true;

        tapeAction?.reset().setLoop(LoopOnce, 1).play();
        tapeAction!.clampWhenFinished = true;
      })
      .catch((err) => {
        console.warn("❌ Video play failed:", err);
      });
  };

  return (
    <group ref={group} dispose={null} scale={[0.9, 0.9, 0.9]}>
      <primitive object={scene} />

      {nodes.VideoScreen_Object && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.VideoScreen_Object.geometry}
          position={nodes.VideoScreen_Object.position}
          rotation={nodes.VideoScreen_Object.rotation}
          scale={nodes.VideoScreen_Object.scale}
        >
          <meshBasicMaterial
            key={videoTexture?.uuid}
            map={videoTexture ?? undefined}
            toneMapped={false}
            side={DoubleSide}
            color={!videoTexture ? "red" : undefined}
          />
        </mesh>
      )}

      {nodes.Wall_Left && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wall_Left.geometry}
          position={nodes.Wall_Left.position}
          rotation={nodes.Wall_Left.rotation}
          scale={nodes.Wall_Left.scale}
        >
          <meshStandardMaterial color="white" />
        </mesh>
      )}

      {showButton && (
        <Html position={[0, 0.5, 1]} distanceFactor={5} center>
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
        </Html>
      )}
    </group>
  );
}

// SourceReveal for NRK Citation
function SourceReveal() {
  const [showSource, setShowSource] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSource(!showSource)}
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          fontWeight: "bold",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        {showSource ? "Hide Source" : "Source"}
      </button>

      {showSource && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 10001,
            maxWidth: "400px",
            pointerEvents: "none",
            background: "transparent",
          }}
        >
          <Image
            src="/nrk-citation.webp"
            alt="NRK citation"
            width={400}
            height={400}
            style={{
              width: "100%",
              height: "auto",
              background: "transparent",
            }}
          />
        </div>
      )}
    </>
  );
}

// Contact Page Main
export default function ContactPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  const { screenSize, isLandscape } = useScreenSize();
  const shouldPrompt = (screenSize === "mobile" || screenSize === "tablet") && !isLandscape;

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleTogglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const src = "https://vz-67d4e9fb-0bc.b-cdn.net/750e5060-2f53-432b-a9f6-4b55e14c3663/playlist.m3u8";

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

  if (shouldPrompt) return <OrientationPrompt />;

  return (
    <>
      <Loader />

      <video
        ref={videoRef}
        muted={isMuted}
        autoPlay
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />

      {sceneLoaded && (
        <>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
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

            <button
              onClick={handleTogglePlayPause}
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
              {isPaused ? "Play" : "Pause"}
            </button>
          </div>

          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 10000,
            }}
          >
            <SourceReveal />
          </div>
        </>
      )}

      <div style={{ height: "100vh", background: "#2c2c2c" }}>
        <Canvas shadows camera={{ position: [3.18, 1.96, 10.56], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <hemisphereLight color="#ffffff" groundColor="#222222" intensity={0.8} />
          <directionalLight
            castShadow
            position={[10, 15, 10]}
            intensity={1.4}
            color="#fff9d6"
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-bias={-0.001}
          />
          <spotLight
            position={[4, 5, 9]}
            angle={0.35}
            distance={5}
            intensity={10}
            penumbra={0.5}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-bias={-0.001}
          />

          <Environment files="/the_sky_is_on_fire_4k.hdr" background="only" />

          <Suspense fallback={null}>
            <TVScene videoRef={videoRef} onLoaded={() => setSceneLoaded(true)} />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            target={[0, 0, 0]}
            minDistance={8}
            maxDistance={11.2}
            minPolarAngle={1.395}
            maxPolarAngle={1.395}
            minAzimuthAngle={0.293}
            maxAzimuthAngle={0.493}
            enablePan={false}
          />
        </Canvas>
      </div>
    </>
  );
}
