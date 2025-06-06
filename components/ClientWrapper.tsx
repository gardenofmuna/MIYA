"use client";

import { usePathname } from "next/navigation";
import MenuOverlay from "./MenuOverlay";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show menu only on these routes
  const showMenuRoutes = [
    "/About-Us",
    "/To-Grandma",
    "/letter",
    "/UofT-1990",
    "/Forfatterinne-i-dag-Flora-Nwapa-1987",
    "/Flora-Zuru-Muna-Amede",
  ];

  const showMenu = showMenuRoutes.includes(pathname);

  return (
    <>
      {showMenu && <MenuOverlay />}
      {children}
    </>
  );
}
