"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(); // Sử dụng namespace profilePage
  // Profile state
  const [formData, setFormData] = useState<User>({ ...user });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  // File states for avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
    if (!formData.fullName?.trim())
      e.fullName = t("validation.fullNameRequired");
    if (!formData.email?.trim()) e.email = t("validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = t("validation.invalidEmail");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Validate password form
  const validatePassword = (): boolean => {
    const e: FormErrors = {};
    if (!oldPassword.trim())
      e.oldPassword = t("validation.oldPasswordRequired");
    if (!password.trim()) e.password = t("validation.newPasswordRequired");
    else if (password.length < 8)
      e.password = t("validation.passwordMinLength");
    if (password !== confirmPassword)
      e.confirmPassword = t("validation.passwordsMismatch");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle profile change
  const handleChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Handle file changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle profile submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    const data = new FormData();
    data.append("FullName", formData.fullName);
    data.append("email", formData.email);
    data.append("PhoneNumber", formData.phoneNumber);
    data.append("Address", formData.address ?? "");
    data.append("DateOfBirth", formData.dateOfBirth);
    data.append("Gender", formData.gender.toString());
    // Add avatar file if selected
    if (avatarFile) {
      data.append("avatarFile", avatarFile);
    }

    updateProfile(data, {
      onSuccess: (resp: ProfileUpdateResponse) => {
        if (resp.code === 200 && resp.statusCode === "Success") {
          toast.success(t("toast.updateSuccess"));
          setShowSuccess(true);
          onSave?.(formData);
          setTimeout(() => {
            setShowSuccess(false);
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          toast.error(t("toast.updateFailed"));
          setErrors((e) => ({
            ...e,
            general: t("validation.updateFailed"),
          }));
        }
      },
      onError: (err: any) => {
        toast.error(t("toast.updateFailed"));
        setErrors((e) => ({
          ...e,
          general: t("validation.updateFailed") || err?.message,
        }));
      },
    });
  };

  // Handle password submit
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
            toast.success(t("toast.passwordChangeSuccess"));
            setShowPasswordSuccess(true);
            setShowPasswordForm(false);
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            setTimeout(() => {
              setShowPasswordSuccess(false);
            }, 1500);
          } else {
            toast.error(t("toast.passwordChangeFailed") || resp.message);
            setErrors((e) => ({
              ...e,
              general: t("toast.passwordChangeFailed") || resp.message,
            }));
          }
        },
        onError: (err: any) => {
          console.log("Change password error:", err);
          toast.error(
            t("toast.passwordChangeFailed") ||
              err?.response?.data?.message ||
              err?.message
          );
          setErrors((e) => ({
            ...e,
            general:
              t("toast.passwordChangeFailed") ||
              err?.response?.data?.message ||
              err?.message,
          }));
        },
      }
    );
  };
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar ?? null
  );
  React.useEffect(() => {
    if (user && !avatarFile) {
      setAvatarPreview(user.avatar ?? null);
    }
  }, [user]);

  if (showSuccess)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              {t("modal.success")}
            </h3>
            <p className="text-center text-gray-600">
              {t("modal.updateSuccessMessage")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );

  if (showPasswordSuccess)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              {t("modal.passwordChanged")}
            </h3>
            <p className="text-center text-gray-600">
              {t("modal.passwordChangeSuccessMessage")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("modal.editProfile")}</DialogTitle>
          <DialogDescription>
            {t("modal.editProfileDescription")}
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
            <h4 className="font-semibold text-gray-900">
              {t("modal.accountInformation")}
            </h4>
            <div>
              <Label htmlFor="fullName">{t("modal.fullName")} *</Label>
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
              <Label htmlFor="email">{t("modal.email")} *</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="avatarFile">{t("modal.avatar")}</Label>
              <Input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              {avatarPreview && (
                <div className="mt-2">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              {t("modal.personalInformation")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">{t("modal.dateOfBirth")} *</Label>
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
                <Label htmlFor="gender">{t("modal.gender")} *</Label>
                <Select
                  value={
                    typeof formData.gender === "number"
                      ? String(formData.gender)
                      : ""
                  }
                  onValueChange={(v) => handleChange("gender", Number(v))}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder={t("modal.selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      {t("personalInfo.fields.male")}
                    </SelectItem>
                    <SelectItem value="1">
                      {t("personalInfo.fields.female")}
                    </SelectItem>
                    <SelectItem value="2">
                      {t("personalInfo.fields.unspecified")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">{t("modal.phoneNumber")} *</Label>
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
            <h4 className="font-semibold text-gray-900">
              {t("modal.addressInformation")}
            </h4>
            <div>
              <Label htmlFor="address">{t("modal.address")} *</Label>
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
              {t("modal.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("modal.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
