"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OTPFormProps {
  onSubmit: (otp: string) => Promise<void>;
  timeLeft: number;
  loading: boolean;
  message?: string;
  error?: string;
  onResend: () => Promise<void>;
}

function OTPForm({
  onSubmit,
  timeLeft,
  loading,
  message,
  error,
  onResend,
}: OTPFormProps) {
  const [otp, setOtp] = useState("");

  // Utility function to format time (e.g., seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số");
      return;
    }
    await onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <InputOTP
        className="justify-center w-full"
        maxLength={6}
        value={otp}
        onChange={(val) => setOtp(val)}
      >
        <InputOTPGroup className="justify-center gap-x-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-14 h-16 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {timeLeft > 0 ? (
        <p className="text-sm text-gray-600 text-center">
          Mã sẽ hết hạn sau: {formatTime(timeLeft)}
        </p>
      ) : (
        <p className="text-sm text-red-500 text-center">
          Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.
        </p>
      )}

      {message && (
        <p className="text-green-500 text-sm text-center">{message}</p>
      )}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button
        onClick={async () => await onResend()}
        disabled={loading || timeLeft > 0}
        className={`w-full py-2 rounded-md transition ${
          timeLeft > 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {loading ? "Đang gửi..." : "Gửi lại mã xác minh"}
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? "Đang xác minh..." : "Xác nhận"}
      </Button>
    </form>
  );
}

export default OTPForm;
