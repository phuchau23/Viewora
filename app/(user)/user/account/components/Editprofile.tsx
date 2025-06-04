"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useUpdateProfile, useChangePassword } from "@/hooks/useUsers";
import { toast } from "sonner";
import type {
  ProfileUpdateResponse,
  ChangePasswordResponse,
} from "@/lib/api/service/fetchUser";

export interface ProfileUpdateDataResponse {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string | null;
  identityCard: string | null;
  address: string | null;
  dateOfBirth: string;
  gender: number;
}
interface User extends ProfileUpdateDataResponse {
  id?: string;
}
interface FormErrors {
  [k: string]: string | undefined;
  general?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
}
interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  // Profile state
  const [formData, setFormData] = useState<User>({ ...user });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false); // Thêm state cho thông báo đổi password

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutations
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  // Validate profile form
  const validateProfile = (): boolean => {
    const e: FormErrors = {};
    if (!formData.fullName?.trim()) e.fullName = "Full name is required";
    if (!formData.email?.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Please enter a valid email address";
    if (!formData.phoneNumber?.trim())
      e.phoneNumber = "Phone number is required";
    if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    if (formData.gender == null) e.gender = "Gender is required";
    if (!formData.identityCard?.trim())
      e.identityCard = "Identity card is required";
    if (!formData.address?.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Validate password form
  const validatePassword = (): boolean => {
    const e: FormErrors = {};
    if (!oldPassword.trim()) e.oldPassword = "Current password is required";
    if (!password.trim()) e.password = "New password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle profile change
  const handleChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Handle profile submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("avatar", formData.avatar ?? "");
    data.append("identityCard", formData.identityCard ?? "");
    data.append("address", formData.address ?? "");
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender.toString());
    // KHÔNG gửi password ở đây!

    updateProfile(data, {
      onSuccess: (resp: ProfileUpdateResponse) => {
        if (resp.code === 200 && resp.statusCode === "Success") {
          toast.success("Cập nhật thông tin thành công!");
          setShowSuccess(true);
          onSave?.(formData);
          setTimeout(() => {
            setShowSuccess(false);
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          toast.error("Cập nhật thất bại!");
          setErrors((e) => ({
            ...e,
            general: "Cập nhật thất bại. Vui lòng thử lại!",
          }));
        }
      },
      onError: (err: any) => {
        toast.error(err?.message || "Cập nhật thất bại. Vui lòng thử lại!");
        setErrors((e) => ({
          ...e,
          general:
            err?.message || "Failed to update profile. Please try again.",
        }));
      },
    });
  };

  // Handle password submit (tách khỏi form profile, chỉ là hàm gọi khi bấm nút)
  const handleChangePassword = () => {
    if (!validatePassword()) return;

    changePassword(
      {
        oldPassword,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      },
      {
        onSuccess: (resp: ChangePasswordResponse) => {
          console.log("Change password success:", resp);
          if (resp.code === 200 && resp.statusCode === "Success") {
            toast.success("Đổi mật khẩu thành công!");
            setShowPasswordSuccess(true); // Thêm thông báo thành công
            setShowPasswordForm(false);
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            setTimeout(() => {
              setShowPasswordSuccess(false);
            }, 1500); // Thông báo tự ẩn sau 1.5s
          } else {
            toast.error(resp.message || "Đổi mật khẩu thất bại!");
            setErrors((e) => ({
              ...e,
              general: resp.message || "Đổi mật khẩu thất bại!",
            }));
          }
        },
        onError: (err: any) => {
          console.log("Change password error:", err);
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Đổi mật khẩu thất bại!"
          );
          setErrors((e) => ({
            ...e,
            general:
              err?.response?.data?.message ||
              err?.message ||
              "Đổi mật khẩu thất bại!",
          }));
        },
      }
    );
  };

  if (showSuccess)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Success!
            </h3>
            <p className="text-center text-gray-600">
              Update information successfully
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );

  // Thông báo đổi mật khẩu thành công
  if (showPasswordSuccess)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Password Changed!
            </h3>
            <p className="text-center text-gray-600">
              You have successfully changed your password.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Account Information</h4>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Password</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordForm((v) => !v)}
                >
                  {showPasswordForm ? "Cancel" : "Change Password"}
                </Button>
              </div>
              {showPasswordForm && (
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Current Password *"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className={
                        errors.oldPassword ? "border-red-500 pr-10" : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowOldPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.oldPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.oldPassword}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={
                        errors.password ? "border-red-500 pr-10" : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={
                        errors.confirmPassword
                          ? "border-red-500 pr-10"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    disabled={isChangingPassword}
                    className="w-full"
                    onClick={handleChangePassword}
                  >
                    {isChangingPassword && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Đổi mật khẩu
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender?.toString() || ""}
                  onValueChange={(v) => handleChange("gender", parseInt(v))}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Male</SelectItem>
                    <SelectItem value="1">Female</SelectItem>
                    <SelectItem value="2">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="identityCard">Identity Card *</Label>
                <Input
                  id="identityCard"
                  value={formData.identityCard || ""}
                  onChange={(e) => handleChange("identityCard", e.target.value)}
                  className={errors.identityCard ? "border-red-500" : ""}
                />
                {errors.identityCard && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.identityCard}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Address Information</h4>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
