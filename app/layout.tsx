import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import Script from "next/script";

export const metadata: Metadata = {
  title: "노블맘",
  description: "자녀에게 1분 만에 소설을 만들어 주세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ClerkProvider localization={koKR} afterSignOutUrl="/">
          {children}
        </ClerkProvider>
        <Script src="https://cdn.iamport.kr/v1/iamport.js" />
      </body>
    </html>
  );
}
