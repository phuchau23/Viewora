"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OTPForm from "@/components/shared/OTPForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail, Lock } from "lucide-react";
import { useForgotPassword } from "@/hooks/useAuth";
import { useVerifyResetPassword } from "@/hooks/useAuth";
import { useResetPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState({Email: ""});
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);

  const { forgotPassword, isLoading: forgotLoading } = useForgotPassword();
  const { verifyResetPassword, isLoading: verifyLoading } = useVerifyResetPassword();
  const { resetPassword, isLoading: resetLoading } = useResetPassword();

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, loading]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPassword(email, {
      onSuccess: (response) => {
        if (response.code === 200) {
          setStep(2);
        }
      },
    })
  };

  const onOtpComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otpCode", otpValue);
      verifyResetPassword(formData, {
        onSuccess: (response) => {
          if (response.code === 200) {
            setMessage(response.message);
            setStep(3);
          } else {
            setError(response.message || "Mã OTP không hợp lệ");
          }
        },
      });
    } catch (err) {
      setError("Xác minh OTP thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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
              : "Đặt lại mật khẩu"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Nhập email của bạn để nhận mã xác minh khôi phục mật khẩu."
              : step === 2
              ? "Vui lòng nhập mã OTP đã được gửi đến email của bạn."
              : "Nhập mật khẩu mới để hoàn tất khôi phục."}
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
            {message && (
              <Alert variant="default">
                <Mail className="h-4 w-4" />
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={forgotLoading}>
              {forgotLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {forgotLoading ? "Đang gửi..." : "Gửi mã xác minh"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <OTPForm
            Email={email}
            onComplete={onOtpComplete}
            timeLeft={timeLeft}
            onResend={() => {
              const formData = new FormData();
              formData.append("email", email);
              forgotPassword(formData); // Gửi lại OTP
            }}
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
            {message && (
              <Alert variant="default">
                <Mail className="h-4 w-4" />
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {resetLoading ? "Đang đặt lại..." : "Xác nhận mật khẩu mới"}
            </Button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            <Alert variant="default">
              <AlertTitle>Hoàn tất</AlertTitle>
              <AlertDescription>
                Mật khẩu đã được thay đổi thành công. <Link href="/login" className="text-primary hover:underline">Đăng nhập ngay</Link>
              </AlertDescription>
            </Alert>
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