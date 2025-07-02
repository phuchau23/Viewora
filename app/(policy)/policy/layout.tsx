"use client"
import "@/app/globals.css"; // Keep this if policy-specific styles are needed, otherwise remove
import { Inter } from 'next/font/google'; // Keep if you use `inter.className` for specific elements in this layout
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] }); // Keep if you use `inter.className` for specific elements in this layout

export default function PolicyLayout({ // Renamed to PolicyLayout for clarity
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Remove <html> and <body> tags
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header/>
      <main className={inter.className}> {/* Apply font class here if desired for the main content */}
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}