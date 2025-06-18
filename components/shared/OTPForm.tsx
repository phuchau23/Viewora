"use client";

import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyEmail, useResendVerifyEmail, useVerifyResetPassword } from "@/hooks/useAuth";

interface OTPFormProps {
  Email: string;
  timeLeft: number;
  actionType: "register" | "forgotpassword";
  onComplete?: (otp: number) => void; // Callback to pass OTP
}

const OTPForm = ({ Email, timeLeft: initialTimeLeft, actionType, onComplete }: OTPFormProps) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  
  const { verifyEmail, isLoading: isVerifyingEmail } = useVerifyEmail();
  const { resendVerifyEmail, isLoading: isResending } = useResendVerifyEmail();
  const { verifyResetPassword, isLoading: isVerifyingReset } = useVerifyResetPassword();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      const otpCode = parseInt(otp);
      if (actionType === "register") {
        verifyEmail({ Email, otpCode: otpCode }, {
          onSuccess: () => onComplete?.(otpCode),
        });
      } else {
        verifyResetPassword({ Email, otpCode: otpCode }, {
          onSuccess: () => onComplete?.(otpCode),
        });
      }
    } else {
      toast.error("Vui lòng nhập đủ 6 số");
    }
  };

  const handleResend = () => {
    resendVerifyEmail({ Email });
    setTimeLeft(initialTimeLeft); // Reset timer on resend
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-center items-center">
        <InputOTP
          className="w-full"
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
      </div>
      {timeLeft > 0 ? (
        <p className="text-sm text-gray-600 text-center">
          Mã sẽ hết hạn sau: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}
        </p>
      ) : (
        <p className="text-sm text-red-500 text-center">
          Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.
        </p>
      )}
      <Button
        onClick={handleResend}
        disabled={timeLeft > 0 || isResending}
        className={`w-full py-2 rounded-md transition ${
          timeLeft > 0 || isResending
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        Gửi lại mã xác minh
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isVerifyingEmail || isVerifyingReset}
        className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
        Xác nhận
      </Button>
    </div>
  );
};

export default OTPForm;