// src/components/SocialAuthButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface SocialAuthButtonsProps {
  label?: string;
  onGoogleClick?: () => void;
  isGoogleLoading?: boolean; // Thêm để hiển thị trạng thái loading
}

export function SocialAuthButtons({
  label = "Hoặc đăng nhập bằng",
  onGoogleClick,
  isGoogleLoading = false,
}: SocialAuthButtonsProps) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {label && (
        <div className="flex items-center gap-4 w-full my-6">
          <div className="flex-1 h-px bg-gray-500" />
          <span className="mx-4 text-gray-500 text-base">{label}</span>
          <div className="flex-1 h-px bg-gray-500" />
        </div>
      )}
      <div className="flex flex-row gap-4 w-full">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-lg hover:bg-red-200 hover:text-red-800"
          onClick={onGoogleClick}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          ) : (
            <FcGoogle className="text-xl" />
          )}
          Google
        </Button>
      </div>
    </div>
  );
}