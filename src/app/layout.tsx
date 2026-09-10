import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { ArchiveShell } from "@/components/chrome/ArchiveShell";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const cond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cond",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Creative Control",
    template: "%s — Creative Control",
  },
  description: "A cultural archive and media platform. One archive. Many lenses.",
  icons: {
    icon: "/brand/creative-control-mark.png",
    apple: "/brand/creative-control-mark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070706",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${cond.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-void font-sans text-paper antialiased">
        <div className="grain" aria-hidden />
        <Suspense>
          <ArchiveShell>{children}</ArchiveShell>
        </Suspense>
      </body>
    </html>
  );
}
