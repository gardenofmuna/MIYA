"use client";

import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import Loader from "./Loader";

function HoverableBook({
  object,
  onClick,
}: {
  object: THREE.Object3D;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const cloned = object.clone(true);
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: "white",
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    roughness: 1,
    metalness: 0,
  });

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = glowMaterial;
    }
  });

  return (
    <group
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <primitive object={object} />
      {hovered && <primitive object={cloned} />}
    </group>
  );
}

function InteractiveScene() {
  
  const { scene } = useGLTF("https://miya-assets.b-cdn.net/scene.glb");
  const router = useRouter();

  const book1 = scene.getObjectByName("Book1");
  const book2 = scene.getObjectByName("Book2");
  const book3 = scene.getObjectByName("Book3");
  const table = scene.getObjectByName("Table");
  const chair = scene.getObjectByName("Chair");
  const carpet = scene.getObjectByName("Carpet");
  const floor = scene.getObjectByName("Floor");
  const wallLeft = scene.getObjectByName("Wall_Left");
  const wallBack = scene.getObjectByName("Wall_Back");
  const wallRight = scene.getObjectByName("Wall_Right");
  const lamp = scene.getObjectByName("desk_lamp_arm");
  const window = scene.getObjectByName("Window");

  const all = [
    book1, book2, book3, table, chair, carpet,
    floor, wallLeft, wallBack, wallRight,
    lamp, window,
  ];

  all.forEach((obj) => {
    if (obj) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return (
    <group>
      {floor && <primitive object={floor} />}
      {wallLeft && <primitive object={wallLeft} />}
      {wallBack && <primitive object={wallBack} />}
      {wallRight && <primitive object={wallRight} />}
      {carpet && <primitive object={carpet} />}
      {chair && <primitive object={chair} />}
      {table && <primitive object={table} />}
      {lamp && <primitive object={lamp} />}
      {window && <primitive object={window} />}
      {book1 && <HoverableBook object={book1} onClick={() => router.push("/about")} />}
      {book2 && <HoverableBook object={book2} onClick={() => router.push("/work")} />}
      {book3 && <HoverableBook object={book3} onClick={() => router.push("/contact")} />}
    </group>
  );
}

function CustomEnvironment() {
  const { scene } = useThree();
  const reflectionHDR = useLoader(RGBELoader, "/hdr/aircraft_workshop_01_2k.hdr");

  useEffect(() => {
    reflectionHDR.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = reflectionHDR;
  }, [scene, reflectionHDR]);

  return null;
}

function VideoPlane() {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");

    video.src = "https://miya-assets.b-cdn.net/skyloop.mp4";

    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.load();

    video.addEventListener("canplay", () => {
      video.play();
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.needsUpdate = true;
      setTexture(videoTexture);
    });
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, 10]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[7.5, 4]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function SceneCanvas() {
  return (
    <>
      <Loader />
      <Canvas
        shadows
        camera={{ position: [0.092, 4.574, -4.0], fov: 50, near: 0.01, far: 1000 }}
        style={{ background: "#111", width: "100vw", height: "100vh" }}
        gl={{ toneMappingExposure: 1.5 }}
      >
        <Suspense fallback={null}>
          <CustomEnvironment />
          <VideoPlane />
          <OrbitControls
            target={[0, 1.5, 0]}
            minDistance={1}
            maxDistance={4}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.2}
            enablePan={false}
            enableZoom={true}
            enableRotate={false}
            zoomSpeed={1.5}
            rotateSpeed={0.3}
          />
          <InteractiveScene />
        </Suspense>
      </Canvas>
    </>
  );
}
