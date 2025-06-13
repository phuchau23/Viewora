"use client";

import { useState } from "react";
import Link from "next/link";
import OTPForm from "@/components/shared/OTPForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState<number>(0);
  const [step, setStep] = useState(1);

  const { forgotPassword, isLoading: forgotLoading } = useForgotPassword();
  const { resetPassword, isLoading: resetLoading } = useResetPassword();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPassword(
      { Email: email },
      {
        onSuccess: () => {
          setStep(2);
        },
      }
    );
  };

  const handleOtpComplete = (otpValue: number) => {
    setOtp(otpValue);
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới phải có ít nhất 8 ký tự",
        variant: "destructive",
      });
      return;
    }
    resetPassword(
      { Email: email, NewPassword: newPassword, OtpCode: otp },
      {
        onSuccess: () => {
          setStep(4);
        },
      }
    );
  };

  return (
    <div className="my-auto h-[calc(100vh-4rem)] flex justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6 border">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">
            {step === 1
              ? "Quên mật khẩu?"
              : step === 2
              ? "Nhập mã xác minh"
              : step === 3
              ? "Đặt lại mật khẩu"
              : "Hoàn tất"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Nhập email để nhận mã xác minh."
              : step === 2
              ? "Nhập mã OTP được gửi đến email của bạn."
              : step === 3
              ? "Nhập mật khẩu mới để hoàn tất."
              : "Mật khẩu đã được thay đổi thành công."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              required
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={forgotLoading}>
              {forgotLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {forgotLoading ? "Đang gửi..." : "Gửi mã xác minh"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <OTPForm
            Email={email}
            timeLeft={300} // 5 minutes
            actionType="forgotpassword"
            onComplete={handleOtpComplete}
          />
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              type="password"
              required
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {resetLoading ? "Đang đặt lại..." : "Xác nhận mật khẩu mới"}
            </Button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            <p>
              Mật khẩu đã được thay đổi thành công.{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        )}

        <div className="text-center text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-primary">
            Đã nhớ mật khẩu? <span className="font-medium">Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
}