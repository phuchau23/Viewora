"use client"
import "@/app/globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Header />
      <main className="flex-1">{children}</main>
    </ThemeProvider>
  );
}
