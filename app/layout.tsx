import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

const csCalebMono = localFont({
  src: [
    {
      path: "./fonts/CSCalebMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CSCalebMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cs-caleb-mono",
  display: "swap",
});

const pixerif = localFont({
  src: "./fonts/Pixerif-Regular.woff",
  weight: "400",
  style: "normal",
  variable: "--font-pixerif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PARITY — Solana Contract Playground & AI Verification",
  description:
    "Where Solana contracts meet intelligent verification. A smart contract framework with composable skills and APIs that enable AI agents like Cursor, Claude Code, and OpenClaw to perform audit-level code review.",
  icons: {
    icon: "/logo-trs.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PARITY — Solana Contract Playground & AI Verification",
    description:
      "A smart contract framework with composable skills and APIs that enable AI agents to perform audit-level code review.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${csCalebMono.variable} ${pixerif.variable} ${dmSans.variable} ${instrumentSerif.variable} antialiased`}
      >
        <SmoothScroll>
          <div className="grain-overlay" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
