"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Xử lý đăng ký ở đây (call API)
    setTimeout(() => setIsLoading(false), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-2">Đăng ký tài khoản mới</h2>
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-600 hover:text-orange-500 transition"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-orange-600 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Nhập họ và tên"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-orange-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            />
          </div>
          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-orange-600 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            />
          </div>
          {/* Địa chỉ */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-orange-600 mb-1">
              Địa chỉ
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              placeholder="Nhập địa chỉ"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            ></textarea>
          </div>
          {/* Mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-orange-600 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Tạo mật khẩu"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            />
          </div>
          {/* Xác nhận mật khẩu */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-orange-600 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              className="block w-full px-3 py-2 bg-white border border-orange-400 placeholder-orange-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition sm:text-sm"
              required
            />
          </div>
          {/* Nút đăng ký */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}