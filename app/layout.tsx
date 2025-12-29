import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RH KATANA STORE",
  description: "BLACKSMITH INDONESIA 🇮🇩 — Handmade katana & sword store.",
  icons: {
    icon: "/icon.png", // optional: pakai logo kamu jadi favicon juga
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
