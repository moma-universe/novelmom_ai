"use client";
import React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Lines from "@/components/Lines";
import Header from "@/components/Header";
import ToasterContext from "../context/ToasterContext";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className={`dark:bg-black ${inter.className}`}>
      <ThemeProvider
        enableSystem={false}
        attribute="class"
        defaultTheme="light"
      >
        <Lines />
        <Header />
        <ToasterContext />
        {children}
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </body>
  );
};
export default Layout;
