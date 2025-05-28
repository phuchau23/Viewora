"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Giả lập request gửi reset link, thay thế bằng API thật khi cần
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage(
        "Nếu email này tồn tại, chúng tôi đã gửi hướng dẫn khôi phục vào email của bạn."
      );
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Tiêu đề trang */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-orange-500">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-white">
            Enter your email address below and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form gửi yêu cầu khôi phục mật khẩu */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-orange-400 placeholder-orange-300 text-orange-50 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          {/* Hiển thị thông báo thành công hoặc lỗi */}
          {message && <p className="text-green-400 text-center text-sm">{message}</p>}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        {/* Liên kết chuyển hướng về trang đăng nhập */}
        <div className="text-sm text-center">
          <Link
            href="/login"
            className="font-medium text-orange-50 hover:text-orange-300"
          >
            Remember your password? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
