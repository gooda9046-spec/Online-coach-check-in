import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.forgecoach.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Forge | Run Your Entire Coaching Business in One Place",
    template: "%s | Forge",
  },
  description:
    "Forge is the all-in-one platform for fitness and performance coaches — program workouts, manage clients, track nutrition, and get paid, with a companion app your clients will actually love.",
  keywords: [
    "coaching software",
    "fitness coaching platform",
    "online coaching app",
    "workout programming software",
    "client management for trainers",
  ],
  openGraph: {
    title: "Forge | Run Your Entire Coaching Business in One Place",
    description:
      "Programming, client management, nutrition, and payments — unified in one platform built for coaches, with a companion app clients love.",
    url: siteUrl,
    siteName: "Forge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge | Run Your Entire Coaching Business in One Place",
    description:
      "The all-in-one platform for fitness and performance coaches. Programming, clients, nutrition, and payments in one place.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
