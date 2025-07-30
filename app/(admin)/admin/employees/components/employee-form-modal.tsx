"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Employee } from "@/lib/api/service/fetchEmployees";
import { Eye, EyeOff } from "lucide-react";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  mode: "add" | "edit";
  initialData?: Employee | null;
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: EmployeeFormModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Position: "",
    Department: "",
    WorkLocation: "",
    BaseSalary: 0,
    Account: {
      Email: "",
      FullName: "",
      DateOfBirth: "",
      Gender: "Male" as "Male" | "Female",
      PhoneNumber: "",
      Password: "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        Position: initialData.position || "",
        Department: initialData.department || "",
        WorkLocation: initialData.workLocation || "",
        BaseSalary: initialData.baseSalary || 0,
        Account: {
          Email: initialData.account.email || "",
          FullName: initialData.account.fullName || "",
          DateOfBirth: initialData.account.dateOfBirth || "",
          Gender: initialData.account.gender as "Male" | "Female",
          PhoneNumber: initialData.account.phoneNumber || "",
          Password: "",
        },
      });
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Position.trim())
      newErrors.Position = t("employeeInformation.errors.positionRequired");
    if (!formData.Department.trim())
      newErrors.Department = t("employeeInformation.errors.departmentRequired");
    if (!formData.WorkLocation.trim())
      newErrors.WorkLocation = t(
        "employeeInformation.errors.workLocationRequired"
      );
    if (formData.BaseSalary <= 0)
      newErrors.BaseSalary = t("employeeInformation.errors.baseSalaryPositive");
    if (!formData.Account.Email.trim())
      newErrors["Account.Email"] = t(
        "employeeInformation.errors.emailRequired"
      );
    if (!formData.Account.FullName.trim())
      newErrors["Account.FullName"] = t(
        "employeeInformation.errors.fullNameRequired"
      );
    if (!formData.Account.DateOfBirth)
      newErrors["Account.DateOfBirth"] = t(
        "employeeInformation.errors.dobRequired"
      );
    if (!formData.Account.PhoneNumber.trim())
      newErrors["Account.PhoneNumber"] = t(
        "employeeInformation.errors.phoneRequired"
      );
    if (mode === "add" && !formData.Account.Password.trim())
      newErrors["Account.Password"] = t(
        "employeeInformation.errors.passwordRequired"
      );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith("Account.")) {
      const subField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        Account: { ...prev.Account, [subField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? t("employeeInformation.addTitle")
              : t("employeeInformation.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? t("employeeInformation.addDescription")
              : t("employeeInformation.editDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("employeeInformation.sections.employeeInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">
                  {t("employeeInformation.fields.position")} *
                </Label>
                <Input
                  id="position"
                  value={formData.Position}
                  onChange={(e) =>
                    handleInputChange("Position", e.target.value)
                  }
                  placeholder={t("employeeInformation.placeholders.position")}
                  maxLength={28}
                  className={errors.Position ? "border-destructive" : ""}
                />
                {errors.Position && (
                  <p className="text-sm text-destructive">{errors.Position}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">
                  {t("employeeInformation.fields.department")} *
                </Label>
                <Input
                  id="department"
                  value={formData.Department}
                  onChange={(e) =>
                    handleInputChange("Department", e.target.value)
                  }
                  placeholder={t("employeeInformation.placeholders.department")}
                  maxLength={28}
                  className={errors.Department ? "border-destructive" : ""}
                />
                {errors.Department && (
                  <p className="text-sm text-destructive">
                    {errors.Department}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workLocation">
                  {t("employeeInformation.fields.workLocation")} *
                </Label>
                <Input
                  id="workLocation"
                  value={formData.WorkLocation}
                  onChange={(e) =>
                    handleInputChange("WorkLocation", e.target.value)
                  }
                  placeholder={t(
                    "employeeInformation.placeholders.workLocation"
                  )}
                  maxLength={28}
                  className={errors.WorkLocation ? "border-destructive" : ""}
                />
                {errors.WorkLocation && (
                  <p className="text-sm text-destructive">
                    {errors.WorkLocation}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">
                  {t("employeeInformation.fields.baseSalary")} *
                </Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={formData.BaseSalary}
                  onChange={(e) =>
                    handleInputChange(
                      "BaseSalary",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={t("employeeInformation.placeholders.baseSalary")}
                  className={errors.BaseSalary ? "border-destructive" : ""}
                />
                {errors.BaseSalary && (
                  <p className="text-sm text-destructive">
                    {errors.BaseSalary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("employeeInformation.sections.accountInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.Email">
                  {t("employeeInformation.fields.email")} *
                </Label>
                <Input
                  id="Account.Email"
                  value={formData.Account.Email}
                  onChange={(e) =>
                    handleInputChange("Account.Email", e.target.value)
                  }
                  placeholder={t("employeeInformation.placeholders.email")}
                  maxLength={28}
                  className={
                    errors["Account.Email"] ? "border-destructive" : ""
                  }
                />
                {errors["Account.Email"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.Email"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.FullName">
                  {t("employeeInformation.fields.fullName")} *
                </Label>
                <Input
                  id="Account.FullName"
                  value={formData.Account.FullName}
                  onChange={(e) =>
                    handleInputChange("Account.FullName", e.target.value)
                  }
                  placeholder={t("employeeInformation.placeholders.fullName")}
                  maxLength={28}
                  className={
                    errors["Account.FullName"] ? "border-destructive" : ""
                  }
                />
                {errors["Account.FullName"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.FullName"]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.DateOfBirth">
                  {t("employeeInformation.fields.dateOfBirth")} *
                </Label>
                <Input
                  id="Account.DateOfBirth"
                  type="date"
                  value={formData.Account.DateOfBirth}
                  onChange={(e) =>
                    handleInputChange("Account.DateOfBirth", e.target.value)
                  }
                  className={
                    errors["Account.DateOfBirth"] ? "border-destructive" : ""
                  }
                />
                {errors["Account.DateOfBirth"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.DateOfBirth"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.Gender">
                  {t("employeeInformation.fields.gender")} *
                </Label>
                <Select
                  value={formData.Account.Gender}
                  onValueChange={(value) =>
                    handleInputChange("Account.Gender", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("employeeInformation.placeholders.gender")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">
                      {t("employeeInformation.gender.male")}
                    </SelectItem>
                    <SelectItem value="Female">
                      {t("employeeInformation.gender.female")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors["Account.Gender"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.Gender"]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.PhoneNumber">
                  {t("employeeInformation.fields.phoneNumber")} *
                </Label>
                <Input
                  id="Account.PhoneNumber"
                  value={formData.Account.PhoneNumber}
                  onChange={(e) =>
                    handleInputChange("Account.PhoneNumber", e.target.value)
                  }
                  placeholder={t(
                    "employeeInformation.placeholders.phoneNumber"
                  )}
                  maxLength={28}
                  className={
                    errors["Account.PhoneNumber"] ? "border-destructive" : ""
                  }
                />
                {errors["Account.PhoneNumber"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.PhoneNumber"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.Password">
                  {t("employeeInformation.fields.password")} *
                </Label>
                <div className="relative">
                  <Input
                    id="Account.Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.Account.Password}
                    onChange={(e) =>
                      handleInputChange("Account.Password", e.target.value)
                    }
                    placeholder={t("employeeInformation.placeholders.password")}
                    maxLength={28}
                    className={
                      errors["Account.Password"] ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors["Account.Password"] && (
                  <p className="text-sm text-destructive">
                    {errors["Account.Password"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("employeeInformation.buttons.back")}
            </Button>
            <Button type="submit">
              {mode === "add"
                ? t("employeeInformation.buttons.add")
                : t("employeeInformation.buttons.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
