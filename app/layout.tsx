import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";


export const metadata: Metadata = {
  title: "Bauhaus Typography",
  description: "Bauhaus Typography W25/26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Layout>
        {children}
        </Layout>
      </body>
    </html>
  );
}
