import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artify - AI 이미지 생성",
  description: "AI를 활용한 이미지 생성 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
