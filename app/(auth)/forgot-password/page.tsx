'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import OTPForm from "@/components/shared/OTPForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mail } from "lucide-react";
import { useForgotPassword } from "@/hooks/useAuth";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => { 
    if (!timerActive || timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timerActive, timeLeft]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMessage("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
      setTimeLeft(300);
      setTimerActive(true);
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const onOtpComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setLoading(true);
    setMessage("");
    setError("");

    if (otpValue.length !== 6) {
      setError("Mã OTP phải có 6 chữ số!");
      setLoading(false);
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMessage("Xác minh thành công! Bạn có thể đặt lại mật khẩu.");
    } catch (err) {
      setError("Mã OTP không hợp lệ hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  // const handleResendOtp = async () => {
  //   setLoading(true);
  //   setMessage("");
  //   setError("");

  //   try {
  //     await new Promise((res) => setTimeout(res, 1000));
  //     setMessage("Mã OTP mới đã được gửi đến email của bạn.");
  //     setTimeLeft(300);
  //     setTimerActive(true);
  //   } catch (err) {
  //     setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className=" my-auto h-[calc(100vh-4rem)] flex justify-center items-center   ">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6 border">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">
            {step === 1 ? "Quên mật khẩu?" : "Nhập mã xác minh"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Nhập email của bạn để nhận mã xác minh khôi phục mật khẩu."
              : "Vui lòng nhập mã OTP đã được gửi đến email của bạn."}
          </p>
        </div>

        {/* Form bước 1 */}
        {/* {step === 1 ? ( */}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4 " />}
              {loading ? "Đang gửi..." : "Gửi mã xác minh"}
            </Button>
          </form>
        ) : (
          <OTPForm
            onSubmit={onOtpComplete}
            timeLeft={timeLeft}
            loading={loading}
            message={message}
            error={error}
            email={email}
          />
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
