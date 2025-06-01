// src/components/SocialAuthButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface SocialAuthButtonsProps {
  label?: string;
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
}

export function SocialAuthButtons({
  label = "Hoặc đăng nhập bằng",
  onGoogleClick,
  onFacebookClick,
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
        >
          <FcGoogle className="text-xl" />
          Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-lg hover:bg-blue-200 hover:text-blue-800"
          onClick={onFacebookClick}
        >
          <FaFacebook className="text-xl text-[#1877F2]" />
          Facebook
        </Button>
      </div>
    </div>
  );
}
