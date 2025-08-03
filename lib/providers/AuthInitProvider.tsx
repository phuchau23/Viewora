"use client";

import { useEffect } from "react";
import { cleanExpiredTokenOnLoad } from "@/utils/cookies";

export default function AuthInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    cleanExpiredTokenOnLoad();
  }, []);

  return <>{children}</>;
}
