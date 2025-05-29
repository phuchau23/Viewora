"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const bgImages = [
  "/images/login-bg.jpg",
  "/images/login-bg2.jpg",
  "/images/login-bg3.jpg",
  "/images/login-bg4.jpg",
];
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Auto change background image
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3500); // 3.5s đổi hình
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSendOTP = () => {
    alert(`Mã OTP đã được gửi đến ${forgotEmail}`);
  };

  return (
    <div className="min-h-screen flex flex-row bg-black">
      {/* Left: Background Slideshow + Slogan + Icon */}
      <div className="hidden md:flex flex-col justify-between w-1/2 h-screen bg-black rounded-r-3xl overflow-hidden relative">
        {bgImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Cinema background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === bgIndex ? "opacity-90 z-10" : "opacity-0 z-0"
            }`}
            style={{ transition: "opacity 1s" }}
          />
        ))}
        <div className="relative flex flex-col h-full justify-center items-center z-20 px-14">
          <div className="text-center">
            <h2 className="text-white text-4xl md:text-5xl font-mono mb-6 drop-shadow-lg">
              Welcome to CinemaTix
            </h2>
            <p className="text-gray-200 text-2xl mb-12">
              Đặt vé xem phim, bắp nước và ưu đãi chỉ với 1 chạm!
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-12 py-20 h-screen">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-10 text-center">
            Đăng nhập tài khoản
          </h1>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-6 py-4 bg-white border border-gray-300 rounded-xl shadow-sm text-lg text-gray-700 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              {/* Container bọc input và nút toggle */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-6 py-4 pr-12 bg-white border border-gray-300 rounded-xl shadow-sm text-lg text-gray-700 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <FaEye className="text-gray-500" />
                  ) : (
                    <FaEyeSlash className="text-gray-500" />
                  )}
                </button>
              </div>
              {/* Yêu cầu mật khẩu */}
              <div className="flex justify-between mt-2">
                <div>
                  <ul className="text-sm text-gray-500 space-y-1 pl-3">
                    <li>• Có ít nhất 8 ký tự</li>
                    <li>• Có ít nhất 1 số</li>
                  </ul>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-md text-orange-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 bg-white text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="agree"
                className="ml-3 block text-lg text-gray-700"
              >
                Tôi đồng ý với{" "}
                <Link href="#" className="underline text-orange-600">
                  Điều khoản & Bảo mật
                </Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading || !agree}
              className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-xl shadow transition-all disabled:opacity-60"
            >
              {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
            <div className="text-center text-lg text-gray-500 mt-18">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-orange-600 font-semibold hover:underline"
              >
                Đăng ký
              </Link>
            </div>
            <div className="flex items-center my-20">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-4 text-gray-400 text-base">hoặc</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <div className="flex flex-col gap-5">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-4 border border-gray-300 rounded-xl py-4 px-6 bg-white hover:bg-gray-50 text-gray-700 text-lg font-medium"
              >
                <FaGoogle className="text-2xl text-orange-600" />
                Đăng nhập với Google
              </button>
            </div>
          </form>
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <div className="flex justify-between">
                <h2 className="text-xl text-gray-700 font-bold">Khôi phục mật khẩu</h2>
                <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold mb-4"
                  onClick={() => setShowForgotPassword(false)}
                > 
                  x
                </button>
                </div>
                <label className="block text-lg text-gray-700 mb-2">
                  Nhập email để nhận mã OTP
                </label>
                
                <input
                  type="email"
                  className="w-full px-4 py-3 border rounded-lg mb-4 bg-gray-50"
                  placeholder="Nhập email của bạn"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <button
                  className="w-full bg-orange-600 text-white text-lg font-bold py-3 rounded-lg"
                  onClick={handleSendOTP}
                >
                  <Link href="/forgot-password" className="text-white">Gửi mã OTP</Link>
                </button>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
