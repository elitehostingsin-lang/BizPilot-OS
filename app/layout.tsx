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

export const metadata: Metadata = {
  metadataBase: new URL("https://bizpilotos.pages.dev"),
  title: {
    default: "BizPilot OS - The All-In-One Business Operating System",
    template: "%s | BizPilot OS"
  },
  description: "Advanced business management suite for CRM, automated invoicing, task workflows, and website audits. All tools in one unified dashboard.",
  keywords: ["business operating system", "all-in-one business tool", "SaaS CRM", "automated invoicing", "task management for small business", "website audit tool"],
  authors: [{ name: "BizPilot" }],
  creator: "BizPilot Team",
  publisher: "BizPilot OS",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bizpilotos.pages.dev",
    siteName: "BizPilot OS",
    title: "BizPilot OS - The All-In-One Business Operating System",
    description: "Streamline your entire business with BizPilot OS. CRM, Invoicing, Tasks, and more in one secure dashboard.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BizPilot OS Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizPilot OS - The All-In-One Business Operating System",
    description: "Advanced business management suite for CRM, invoicing, and more.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
