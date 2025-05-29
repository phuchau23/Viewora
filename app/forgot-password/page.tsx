'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import OTPForm from "@/components/shared/OTPForm";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP
  const [timeLeft, setTimeLeft] = useState(10); // 5 phút
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
    console.log(timeLeft);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMessage("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
      setTimeLeft(300);
      setTimerActive(true);
    } catch (err) {
      setError("Đã có lỗi xảy_charge ra. Vui lòng thử lại sau!");
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
      // TODO: Redirect hoặc hiển thị form đổi mật khẩu
    } catch (err) {
      setError("Mã OTP không hợp lệ hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMessage("Mã OTP mới đã được gửi đến email của bạn.");
      setTimeLeft(300);
      setTimerActive(true);
    } catch (err) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {step === 1 ? "Quên mật khẩu?" : "Nhập mã xác minh"}
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          {step === 1
            ? "Nhập email của bạn để nhận mã xác minh khôi phục mật khẩu."
            : "Vui lòng nhập mã OTP đã được gửi đến email của bạn."}
        </p>

        {/* Form bước 1 */}
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 outline-none"
            />

            {message && (
              <p className="text-green-500 text-sm text-center">{message}</p>
            )}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi mã xác minh"}
            </button>
          </form>
        ) : (
          // Form bước 2
          <div className="space-y-4 text-black">
            <OTPForm
              onSubmit={onOtpComplete}
              timeLeft={timeLeft} // Fixed prop name from "timeleft" to "timeLeft"
              loading={loading}
              message={message}
              error={error}
              onResend={handleResendOtp}
            />
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-gray-600 hover:text-orange-500 font-medium"
          >
            Đã nhớ mật khẩu? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}