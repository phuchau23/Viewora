"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { useGoogleLogin, useLogin } from "@/hooks/useAuth";
import Image from "next/image";

const bgImages = [
  "/login-bg.jpg",
  "/login-bg2.jpg",
  "/login-bg3.jpg",
  "/login-bg4.jpg",
];
export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();
  const { googleLogin, isLoading: googleLoading } = useGoogleLogin();
  // Auto change background image
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3500); // 3.5s đổi hình
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return; // tránh gọi login nếu thiếu dữ liệu
    }
    await login(loginData);
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
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
              Welcome to Viewora
            </h2>
            <p className="text-gray-200 text-2xl mb-12">
              Đặt vé xem phim, bắp nước và ưu đãi chỉ với 1 chạm!
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 w-64 h-16">
        <Link href="/" className="text-xl font-bold">
          <Image src="/logo1.png" alt="Viewora Logo" width={120} height={40} />
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
                required
                value={loginData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu"
                  required
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

            <Button type="submit" variant="default" className="text-lg w-full">
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

            <div className="flex flex-col items-center">
              <SocialAuthButtons
                label="Hoặc đăng nhập bằng"
                onGoogleClick={googleLogin}
                isGoogleLoading={googleLoading}
              />
              {googleLoading && <p>Đang xử lý...</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
