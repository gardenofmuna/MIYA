"use client";

import { useThree, useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import { useEffect } from "react";

export default function CustomBackgrounds() {
  const { scene } = useThree();

  const backgroundHDR = useLoader(RGBELoader, "/hdr/the_sky_is_on_fire_4k.hdr");
  const lightingHDR = useLoader(RGBELoader, "/hdr/aircraft_workshop_01_2k.hdr");

  useEffect(() => {
    scene.environment = lightingHDR;
    scene.background = backgroundHDR;
  }, [scene, lightingHDR, backgroundHDR]);

  return null;
}
