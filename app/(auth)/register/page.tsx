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
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OTPForm from "@/components/shared/OTPForm";
import { toast } from "@/hooks/use-toast";
import HeaderRegister from "./components/HeaderRegister";
import { WelcomeSection } from "./components/WelcomSection";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    FullName: "",
    DateOfBirth: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    Gender: undefined as number | undefined,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { strength, color, text } = usePasswordStrength(formData.Password);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.Email || !/^\S+@\S+\.\S+$/.test(formData.Email)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email hợp lệ",
        variant: "destructive",
      });
      return;
    }
    if (!formData.FullName || formData.FullName.length < 2) {
      toast({
        title: "Lỗi",
        description: "Họ và tên phải có ít nhất 2 ký tự",
        variant: "destructive",
      });
      return;
    }
    if (!formData.DateOfBirth) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngày sinh",
        variant: "destructive",
      });
      return;
    }
    if (formData.Gender === undefined) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn giới tính",
        variant: "destructive",
      });
      return;
    }
    if (!formData.PhoneNumber || !/^\+?\d{10,15}$/.test(formData.PhoneNumber)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ",
        variant: "destructive",
      });
      return;
    }
    if (!formData.Password || formData.Password.length < 8) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 8 ký tự",
        variant: "destructive",
      });
      return;
    }
    if (!isPasswordMatch) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    // Gọi API register
    register(formData, {
      onSuccess: (response) => {
        if (response.code === 200) {
          setShowOTPForm(true); // Chuyển sang OTP form
        }
      },
    });
  };
  const isPasswordMatch =
    formData.Password && formData.Password === formData.ConfirmPassword;

  return (
    <div className="h-screen from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <HeaderRegister />
      <div className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Welcome Section */}
            <WelcomeSection />
            {/* Right Side - Registration Form */}
            {showOTPForm ? (
              <div className="w-full h-full flex items-center justify-center">
                <OTPForm
                  Email={formData.Email}
                  timeLeft={60}
                  actionType="register"
                />
              </div>
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
                          <Label htmlFor="FullName" className="font-medium">
                            Họ và tên *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="FullName"
                              placeholder="Nhập họ và tên"
                              value={formData.FullName}
                              onChange={(e) =>
                                handleInputChange("FullName", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="PhoneNumber" className="font-medium">
                            Số điện thoại *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="PhoneNumber"
                              placeholder="0912345678"
                              value={formData.PhoneNumber}
                              onChange={(e) =>
                                handleInputChange("PhoneNumber", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="DateOfBirth" className="font-medium">
                            Ngày sinh *
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="DateOfBirth"
                              type="date"
                              value={formData.DateOfBirth}
                              onChange={(e) =>
                                handleInputChange("DateOfBirth", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Gender" className="font-medium">
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
                                  {formData.Gender === 0
                                    ? "Nam"
                                    : formData.Gender === 1
                                    ? "Nữ"
                                    : formData.Gender === 2
                                    ? "Khác"
                                    : "Giới tính"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup
                                  value={formData.Gender?.toString()}
                                  onValueChange={(value) => {
                                    const newGender = parseInt(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      Gender: newGender,
                                    }));
                                    console.log(
                                      "Updated Gender:",
                                      newGender,
                                      "Type:",
                                      typeof newGender
                                    );
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
                          <Label htmlFor="Email" className="font-medium">
                            Email *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="Email"
                              type="email"
                              placeholder="example@email.com"
                              value={formData.Email}
                              onChange={(e) =>
                                handleInputChange("Email", e.target.value)
                              }
                              className="pl-10 border-gray-600 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Password" className="font-medium">
                            Mật khẩu *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="Password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.Password}
                              onChange={(e) =>
                                handleInputChange("Password", e.target.value)
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
                        {formData.Password && (
                          <div className="space-y-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded ${
                                    level <= strength ? color : "bg-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">
                              Độ mạnh:{" "}
                              <span
                                className={`font-medium ${
                                  strength >= 3
                                    ? "text-green-400"
                                    : strength >= 2
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {text}
                              </span>
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label
                            htmlFor="ConfirmPassword"
                            className="font-medium"
                          >
                            Xác nhận mật khẩu *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="ConfirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.ConfirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "ConfirmPassword",
                                  e.target.value
                                )
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
                          {formData.ConfirmPassword && (
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
                          href="/policy?policy=terms-and-condítions"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link
                          href="/policy?policy=privacy-policy"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          Chính sách bảo mật
                        </Link>{" "}
                        của Viewora
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
