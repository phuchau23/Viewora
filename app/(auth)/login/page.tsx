"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Film } from "lucide-react";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import router from "next/router";
import { useLogin } from "@/hooks/useAuth";

const bgImages = [
  "/images/login-bg.jpg",
  "/images/login-bg2.jpg",
  "/images/login-bg3.jpg",
  "/images/login-bg4.jpg",
];
export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useLogin();

  // Auto change background image
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3500); // 3.5s đổi hình
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginData);
    
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      password: value,
    }));
  };
  return (
    <div className="h-screen flex flex-row">
      {/* Left: Background Slideshow + Slogan + Icon */}
      <div className="hidden md:flex flex-col justify-between w-1/2 h-screen rounded-r-3xl overflow-hidden relative">
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

      <div className="absolute top-4 right-4 flex items-center gap-2 w-64 h-16">
        <Film className="h-6 w-6 text-primary" />
        <Link href="/" className="text-xl font-bold">
          CinemaTix
        </Link>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center px-12 py-20 h-screen">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-10 text-center">
            Đăng nhập tài khoản
          </h1>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-lg text-gray-500">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={handleEmailChange}
                required
                placeholder="Nhập email"
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-lg text-gray-500">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Nhập mật khẩu"
                  className="pr-12 mt-2 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 justify-between">
              <div>
                <Checkbox
                  id="agree"
                  checked={agree}
                  onCheckedChange={(checked) => setAgree(!!checked)}
                  className="mr-2"
                />

                <Label htmlFor="agree" className="text-lg text-gray-500">
                  Tôi đồng ý với{" "}
                  <Link href="#" className="underline text-orange-600">
                    Điều khoản & Bảo mật
                  </Link>
                </Label>
              </div>
              <div className="ml-4">
                <Button
                  variant="link"
                  onClick={() => router.push("/forgot-password")}
                  className="text-orange-600 text-sm font-semibold hover:text-orange-500 hover:underline "
                >
                  Quên mật khẩu
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agree}
              variant="default"
              className="text-lg w-full"
            >
              {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </Button>

            <div className="text-center text-lg text-gray-500">
              Chưa có tài khoản?{" "}
              <Button
                variant="link"
                onClick={() => router.push("/register")}
                className="text-primary font-semibold hover:text-primary hover:underline"
              >
                Đăng ký
              </Button>
            </div>

            <SocialAuthButtons
              label="Hoặc đăng ký bằng"
              onGoogleClick={() => console.log("Google clicked")}
              onFacebookClick={() => console.log("Facebook clicked")}
            />
          </form>

          {/* {showForgotPassword && (
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
          )} */}
        </div>
      </div>
    </div>
  );
}
