import { useFrame, useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import * as THREE from "three";
import { useRef } from "react";

export function RotatingSky() {
  const texture = useLoader(RGBELoader, "/hdr/the_sky_is_on_fire_4k.hdr");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005; // slow rotation
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
