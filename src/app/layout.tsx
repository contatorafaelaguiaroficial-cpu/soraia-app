import type { Metadata } from "next";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";

export const metadata: Metadata = {
  title: "Soraia",
  description: "Sua assessora pessoal por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
