import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CinemaTix - Book Movie Tickets Online",
  description:
    "Book movie tickets online for the latest movies in theaters near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode & { type?: any };
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>   
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </QueryClientProvider> 
      </body>
    </html>
  );
}
