import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { Check } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Đăng Ký
          <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Tài Khoản
          </span>
        </h1>
        <p className="text-lg leading-relaxed">
          Tạo tài khoản để trải nghiệm dịch vụ đặt vé xem phim tuyệt vời nhất
        </p>
        <div className="flex items-center space-x-4">
          <span>Đã có tài khoản?</span>
          <Link href="/login">
            <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
      <SocialAuthButtons label="Hoặc đăng ký bằng" onGoogleClick={() => console.log("Google clicked")} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lợi ích khi đăng ký:</h3>
        <div className="space-y-2 text-bold text-gray-500">
          {[
            "Đặt vé nhanh chóng và tiện lợi",
            "Nhận thông báo phim mới và ưu đãi",
            "Tích điểm và đổi quà hấp dẫn",
            "Lưu lịch sử đặt vé và quản lý dễ dàng",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-500">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}