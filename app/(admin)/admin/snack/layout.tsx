import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white text-green-600 border",
        }}
      />
    </>
  );
}
