import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "سیستم مدیریت تراکنش‌های بانکی",
  description: "مدیریت کارت‌های بانکی و تراکنش‌های مالی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vazir-font@v30.1.0/dist/font-face.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
