import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS Exam Lab — Simulado de Cloud",
  description:
    "Simulado demonstrativo de fundamentos AWS com questões originais, cronômetro e revisão de respostas.",
  applicationName: "AWS Exam Lab",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
