import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DemoBanner from "@/components/layout/DemoBanner";
import Providers from "./providers";

const pretendard = localFont({
  src: [
    {
      path: "../../public/font/Pretendard-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Pretendard-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "sa.field - No.1 서든어택 클랜 리그 플랫폼",
  description: "국내 최대 규모 사설 클랜 리그 & 전적 검색 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9832669420161005"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${pretendard.variable} antialiased bg-brand-50 dark:bg-brand-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen flex flex-col transition-colors duration-300`}
      >
        <Providers>
          <DemoBanner />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
