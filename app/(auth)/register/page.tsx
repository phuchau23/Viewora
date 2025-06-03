
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  ArrowLeft,
  Play,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { useRegister } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OTPForm from "@/components/shared/OTPForm";

export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: undefined as number | undefined,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('FormData before submit:', formData);
      const registerData = {
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender!,
      };
      console.log('Register data:', registerData);
      console.log('Gender type:', typeof formData.gender, 'Value:', formData.gender);

      await register(registerData);
      // Chỉ hiển thị OTPForm khi đăng ký thành công (không có lỗi)
      if (!error) {
        localStorage.setItem('registerData', JSON.stringify(registerData));
        setShowOTPForm(true);
      }
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return "Yếu";
      case 2:
        return "Trung bình";
      case 3:
        return "Mạnh";
      case 4:
        return "Rất mạnh";
      default:
        return "";
    }
  };

  const isPasswordMatch = formData.password && formData.password === formData.confirmPassword;

  return (
    <div className="h-screen from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-bold">CinemaTix</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Welcome Section */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    Đăng Ký
                    <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      Tài Khoản
                    </span>
                  </h1>
                  <p className="text-lg leading-relaxed">
                    Tạo tài khoản để trải nghiệm dịch vụ đặt vé xem phim tuyệt
                    vời nhất
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span>Đã có tài khoản?</span>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>

              <SocialAuthButtons
                label="Hoặc đăng ký bằng"
                onGoogleClick={() => console.log("Google clicked")}
                onFacebookClick={() => console.log("Facebook clicked")}
              />

              {/* Features */}
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

            {/* Right Side - Registration Form */}
            {showOTPForm ? (
              <OTPForm
                Email={formData.email}
                onSuccess={() => setShowOTPForm(false)}
              />
            ) : (
              <Card className="border-gray-700 backdrop-blur-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-center">
                    Thông tin đăng ký
                  </CardTitle>
                  <p className="text-gray-400 text-center">
                    Vui lòng điền đầy đủ thông tin để tạo tài khoản
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hiển thị lỗi từ useRegister */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Separator className="bg-gray-600" />

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-orange-400" />
                        Thông tin liên hệ
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="font-medium">
                            Họ và tên *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="fullName"
                              placeholder="Nhập họ và tên"
                              value={formData.fullName}
                              onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="font-medium">
                            Số điện thoại *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="phoneNumber"
                              placeholder="0912345678"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                handleInputChange("phoneNumber", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="font-medium">
                            Ngày sinh *
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) =>
                                handleInputChange("dateOfBirth", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="font-medium">
                            Giới tính *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                                >
                                  {formData.gender === 0
                                    ? "Nam"
                                    : formData.gender === 1
                                    ? "Nữ"
                                    : formData.gender === 2
                                    ? "Khác"
                                    : "Giới tính"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup
                                  value={formData.gender?.toString()}
                                  onValueChange={(value) => {
                                    const newGender = parseInt(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      gender: newGender,
                                    }));
                                    console.log('Updated Gender:', newGender, 'Type:', typeof newGender);
                                  }}
                                >
                                  <DropdownMenuRadioItem value="0">
                                    Nam
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="1">
                                    Nữ
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="2">
                                    Khác
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                      <Separator />

                      {/* Security Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-orange-400" />
                          Xác thực người dùng
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-medium">
                            Email *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@email.com"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="font-medium">
                            Mật khẩu *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="pl-10 pr-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {formData.password && (
                          <div className="space-y-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded ${
                                    level <= passwordStrength(formData.password)
                                      ? getPasswordStrengthColor(
                                          passwordStrength(formData.password)
                                        )
                                      : "bg-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">
                              Độ mạnh:{" "}
                              <span
                                className={`font-medium ${
                                  passwordStrength(formData.password) >= 3
                                    ? "text-green-400"
                                    : passwordStrength(formData.password) >= 2
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {getPasswordStrengthText(
                                  passwordStrength(formData.password)
                                )}
                              </span>
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="font-medium"
                          >
                            Xác nhận mật khẩu *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange("confirmPassword", e.target.value)
                              }
                              className="pl-10 pr-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {formData.confirmPassword && (
                            <div className="flex items-center space-x-2">
                              {isPasswordMatch ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                              <span
                                className={`text-xs ${
                                  isPasswordMatch
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {isPasswordMatch
                                  ? "Mật khẩu khớp"
                                  : "Mật khẩu không khớp"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked === true)
                        }
                        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-gray-300 leading-relaxed"
                      >
                        Tôi đồng ý với{" "}
                        <Link
                          href="/terms"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link
                          href="/privacy"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          Chính sách bảo mật
                        </Link>{" "}
                        của CinemaTix
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 h-12 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/25"
                      disabled={isLoading || !acceptTerms}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang tạo tài khoản...</span>
                        </div>
                      ) : (
                        "Đăng Ký"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
