import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Studio - Practical Prague",
  description: "Content management",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
