"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import SceneCanvas (with no SSR)
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
});

export default function SceneCanvasWrapper() {
  const pathname = usePathname();
  return <SceneCanvas key={pathname} />;
}
