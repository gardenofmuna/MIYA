import { useEffect, useState } from "react";

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      setIsLandscape(w > h); // Checks orientation

      if (w <= 600) setScreenSize("mobile");
      else if (w <= 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { screenSize, isLandscape };
}
