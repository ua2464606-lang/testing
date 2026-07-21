import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Fry Guys — A Cinematic in Six Moves",
  description:
    "A continuous, scroll-driven cinematic experience for Fry Guys premium frozen food. From the dark, a bucket — to the golden crisp and back.",
  keywords: [
    "Fry Guys",
    "premium frozen food",
    "cinematic website",
    "WebGL",
    "immersive",
  ],
  openGraph: {
    title: "Fry Guys — A Cinematic in Six Moves",
    description:
      "One continuous shot. Scroll moves the camera. Frozen becomes golden.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
