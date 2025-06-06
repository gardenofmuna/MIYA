// app/Flora-Zuru-Muna-Amede/page.tsx
"use client";

import dynamic from "next/dynamic";

const FloraZuruMunaAmede = dynamic(() => import("../../../components/FloraZuruMunaAmede"), {
  ssr: false,
});

export default function FloraZuruMunaAmedePage() {
  return <FloraZuruMunaAmede />;
}
