"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isTokenValid, getToken } from "@/lib/ultils/jwt";

interface RememberMeProps {
  onChange?: (checked: boolean) => void;
}

export function RememberMe({ onChange }: RememberMeProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Kiểm tra trạng thái "Remember me" và token khi component được mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe");
    const token = getToken();

    if (savedRememberMe === "true" && token) {
      setIsLoading(true);
      if (isTokenValid(token)) {
        // Token còn hợp lệ, tự động đăng nhập
        setRememberMe(true);
        router.push("/");
      } else {
        // Token không hợp lệ, xóa "Remember me"
        localStorage.removeItem("rememberMe");
        setRememberMe(false);
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    // Lưu hoặc xóa "Remember me" vào localStorage
    if (checked) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
    // Gọi callback nếu có
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="rememberMe"
        checked={rememberMe}
        onCheckedChange={handleRememberMeChange}
        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        disabled={isLoading}
      />
      <Label htmlFor="rememberMe" className="text-sm text-gray-500">
        Remember me
      </Label>
    </div>
  );
}
