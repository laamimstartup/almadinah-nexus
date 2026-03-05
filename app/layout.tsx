import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Al-Madinah Nexus | Leadership Intelligence Platform",
  description: "The premier Islamic Leadership Intelligence Platform. Where Faith, Knowledge, Leadership, and Innovation converge to build tomorrow's leaders.",
  keywords: ["Al-Madinah School", "Islamic education", "NYC private school", "leadership", "e-learning"],
  openGraph: {
    title: "Al-Madinah Nexus",
    description: "Where Faith meets Future. The Leadership Intelligence Platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-nexus-bg text-white antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
