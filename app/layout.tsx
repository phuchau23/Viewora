import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
<<<<<<< HEAD
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
=======
>>>>>>> 762b9c5976ef571ead2da18f1b9dd4416744400e

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CinemaTix - Book Movie Tickets Online",
  description:
    "Book movie tickets online for the latest movies in theaters near you.",
};

export default function RootLayout({
  children,
<<<<<<< HEAD
}: {
  children: React.ReactNode & { type?: any };
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>   
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </QueryClientProvider> 
=======
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
>>>>>>> 762b9c5976ef571ead2da18f1b9dd4416744400e
      </body>
    </html>
  );
}
