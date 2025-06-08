"use client";

import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyEmail } from "@/hooks/useAuth";

interface OTPFormProps {
  Email: string;
  onSuccess?: () => void; // Optional callback for successful verification
}

const OTPForm = ({ Email, onSuccess }: OTPFormProps) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 60-second countdown
  const { verifyEmail, isLoading: verifyLoading, error: verifyError } = useVerifyEmail();
  


  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Handle form submission for OTP verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số");
      return;
    }
    try {
      await verifyEmail({
        Email: Email,
        optCode: Number(otp),
      });
      toast.success("Xác minh OTP thành công");
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error is handled by useVerifyEmail hook
    }
  };

  return (
    <div className="space-y-4 w-full">
      <InputOTP
        className="justify-center w-full"
        maxLength={6}
        value={otp}
        onChange={(val) => setOtp(val)}
      >
        <InputOTPGroup className="justify-center gap-x-2 ">
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

      {verifyError && (
        <p className="text-red-500 text-sm text-center">{verifyError}</p>
      )}

      {/* <Button
        onClick={handleResendOtp}
        disabled={isResending || timeLeft > 0}
        className={`w-full py-2 rounded-md transition ${
          timeLeft > 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {isResending ? "Đang gửi..." : "Gửi lại mã xác minh"}
      </Button> */}
      <Button
        onClick={handleSubmit}
        disabled={verifyLoading}
        className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50"
      >
        {verifyLoading ? "Đang xác minh..." : "Xác nhận"}
      </Button>
    </div>
  );
};

export default OTPForm;