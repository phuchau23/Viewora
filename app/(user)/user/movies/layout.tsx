import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  );
}
