"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/hooks/useUsers";
import { toast } from "sonner";
import type { ChangePasswordResponse } from "@/lib/api/service/fetchUser";

interface FormErrors {
  [k: string]: string | undefined;
  general?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ChangePassword() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    changePassword(
      {
        oldPassword,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      },
      {
        onSuccess: (resp: ChangePasswordResponse) => {
          if (resp.code === 200 && resp.statusCode === "Success") {
            toast.success(t("toast.passwordChangeSuccess"));
            setShowPasswordSuccess(true);
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            setTimeout(() => setShowPasswordSuccess(false), 1500);
          } else {
            toast.error(t("toast.passwordChangeFailed") || resp.message);
            setErrors((e) => ({
              ...e,
              general: t("toast.passwordChangeFailed") || resp.message,
            }));
          }
        },
        onError: (err: any) => {
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

  if (showPasswordSuccess)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
          {t("modal.passwordChanged")}
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-300">
          {t("modal.passwordChangeSuccessMessage")}
        </p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 rounded-lg shadow p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t("modal.changePassword")}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t("modal.changePasswordDescription")}
      </p>

      <form className="space-y-6" onSubmit={handleChangePassword}>
        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Label htmlFor="oldPassword">{t("modal.currentPassword")} *</Label>
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder={t("modal.currentPasswordPlaceholder")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`${errors.oldPassword ? "border-red-500" : ""} pr-10`}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
              <p className="text-sm text-red-500 mt-1">{errors.oldPassword}</p>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="newPassword">{t("modal.newPassword")} *</Label>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder={t("modal.newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${errors.password ? "border-red-500" : ""} pr-10`}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="confirmPassword">
              {t("modal.confirmNewPassword")} *
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("modal.confirmNewPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${
                errors.confirmPassword ? "border-red-500" : ""
              } pr-10`}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
        </div>

        <Button type="submit" disabled={isChangingPassword} className="w-full">
          {isChangingPassword && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("modal.changePasswordButton")}
        </Button>
      </form>
    </div>
  );
}
