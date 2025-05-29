"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const bgImages = [
    "/images/login-bg.jpg",
    "/images/login-bg2.jpg",
    "/images/login-bg3.jpg",
    "/images/login-bg4.jpg",
  ];

  // State cho các trường thông tin
  const [account, setAccount] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Auto change background image
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Xử lý form hoặc gọi API tại đây
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="h-screen min-h-screen flex flex-row bg-black">
      {/* Left: Background Slideshow + Slogan */}
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

      {/* Right: Registration Form */}
      <div className="p -20 flex flex-1 flex-col justify-top items-center bg-white px-6 py-8">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl md:text-4xl font-bold text-orange-600 mb-10 text-center">
            Đăng ký tài khoản mới
          </h1>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {/* Tài khoản */}
            <div className="col-span-1">
              <label
                htmlFor="account"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Tài khoản*
              </label>
              <input
                type="text"
                id="account"
                name="account"
                placeholder="Nhập tài khoản"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Họ và tên */}
            <div className="col-span-1">
              <label
                htmlFor="fullname"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Họ và tên*
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Ngày sinh */}
            <div className="col-span-1">
              <label
                htmlFor="dob"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Ngày sinh*
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Giới tính */}
            <div className="col-span-1">
              <label
                htmlFor="sex"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Giới tính*
              </label>
              <select
                id="sex"
                name="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label
                htmlFor="email"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div className="col-span-1">
              <label
                htmlFor="phone"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Số điện thoại*
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Địa chỉ */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="address"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Địa chỉ*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* CMND/CCCD */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="identityCard"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                CMND/CCCD*
              </label>
              <input
                type="text"
                id="identityCard"
                name="identityCard"
                placeholder="Nhập số CMND/CCCD"
                value={identityCard}
                onChange={(e) => setIdentityCard(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="col-span-1">
              <label
                htmlFor="password"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Mật khẩu*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Tạo mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="col-span-1">
              <label
                htmlFor="confirmPassword"
                className="block text-md font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu*
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-5 py-3 bg-white border border-gray-400 placeholder-gray-300 text-black rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                required
              />
            </div>

            {/* Checkbox điều khoản */}
            <div className="col-span-1 md:col-span-2 flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 bg-white text-gray-700 focus:ring-orange-500 border-orange-400 rounded"
                required
              />
              <label htmlFor="agree" className="ml-3 block text-md text-gray-700">
                Tôi đồng ý với{" "}
                <Link href="#" className="underline text-orange-600">
                  Điều khoản &amp; Bảo mật
                </Link>
              </label>
            </div>

            {/* Nút đăng ký */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold rounded-xl shadow transition-all disabled:opacity-60"
              >
                {isLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
              </button>
            </div>

            {/* Liên kết đăng nhập */}
            <div className="col-span-1 md:col-span-2 text-center text-md text-gray-500 mt-2">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-orange-600 font-semibold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
