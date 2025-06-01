"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onNext: (email: string) => void;
  loading?: boolean;
  error?: string;
}

export default function ForgotPasswordForm({
  onNext,
  loading,
  error,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onNext(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <Input
        type="email"
        placeholder="Nhập địa chỉ email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center text-sm">
        <Link href="/login" className="text-blue-500 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
      >
        {loading ? "Đang gửi mã..." : "Tiếp theo"}
      </Button>
    </form>
  );
}
