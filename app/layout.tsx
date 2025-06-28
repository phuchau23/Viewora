import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/providers/queryProvider";
import { Toaster } from "@/components/ui/toaster"; // ✅ Đúng thư viện
import { I18nextProvider } from "@/components/i18next-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Viewora - Book Movie Tickets Online",
  description:
    "Book movie tickets online for the latest movies in theaters near you.",
  icons: {
    icon: "/logo1.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <I18nextProvider>
            <ThemeProvider attribute="class" defaultTheme="system">
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
                <Toaster /> {/* ✅ Đặt ở đây */}
              </div>
            </ThemeProvider>
          </I18nextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
