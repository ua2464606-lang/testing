import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/lib/scroll/SmoothScrollProvider";

/**
 * Type pairing:
 *   Fraunces — an editorial serif with high optical contrast for headlines,
 *              set large with generous tracking and a low-to-high weight range.
 *   Inter    — a clean neo-grotesque for body and labels.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FormulaeAI — Your AI Marketing Employee",
  description:
    "A quiet intelligence that markets your local business every day — noticing your brand, creating the work, and sending proof before it ever pitches. No dashboards. Just proof.",
  keywords: [
    "FormulaeAI",
    "AI marketing",
    "local business marketing",
    "AI marketing employee",
    "content creation",
    "social media",
  ],
  authors: [{ name: "FormulaeAI" }],
  openGraph: {
    title: "FormulaeAI — Your AI Marketing Employee",
    description:
      "It notices your business, makes the work, and sends proof before it pitches. No pitch. Just proof.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
