"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import { useCreateEmployee } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEmployeeModal({
  isOpen,
  onClose,
}: CreateEmployeeModalProps) {
  const { t } = useTranslation();
  const { mutate: createEmployee } = useCreateEmployee();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    Position: "",
    Department: "",
    WorkLocation: "",
    BaseSalary: 0,
    "Account.Email": "",
    "Account.FullName": "",
    "Account.DateOfBirth": "",
    "Account.Gender": "Male" as "Male" | "Female",
    "Account.PhoneNumber": "",
    "Account.Password": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        Position: "",
        Department: "",
        WorkLocation: "",
        BaseSalary: 0,
        "Account.Email": "",
        "Account.FullName": "",
        "Account.DateOfBirth": "",
        "Account.Gender": "Male",
        "Account.PhoneNumber": "",
        "Account.Password": "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Position.trim())
      newErrors.Position = t("errors.positionRequired");
    if (!formData.Department.trim())
      newErrors.Department = t("errors.departmentRequired");
    if (!formData.WorkLocation.trim())
      newErrors.WorkLocation = t("errors.workLocationRequired");
    if (formData.BaseSalary <= 0)
      newErrors.BaseSalary = t("errors.baseSalaryPositive");
    if (!formData["Account.Email"].trim())
      newErrors["Account.Email"] = t("errors.emailRequired");
    if (!formData["Account.FullName"].trim())
      newErrors["Account.FullName"] = t("errors.fullNameRequired");
    if (!formData["Account.DateOfBirth"])
      newErrors["Account.DateOfBirth"] = t("errors.dobRequired");
    if (!formData["Account.Gender"].trim())
      newErrors["Account.Gender"] = t("errors.genderRequired");
    if (!formData["Account.PhoneNumber"].trim())
      newErrors["Account.PhoneNumber"] = t("errors.phoneRequired");
    if (!formData["Account.Password"].trim())
      newErrors["Account.Password"] = t("errors.passwordRequired");

    if (
      formData["Account.Email"] &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["Account.Email"])
    ) {
      newErrors["Account.Email"] = t("errors.emailInvalid");
    }

    const maxLength = 28;
    const lengthError = t("errors.maxLength", { max: maxLength });
    if (formData.Position.length > maxLength) newErrors.Position = lengthError;
    if (formData.Department.length > maxLength)
      newErrors.Department = lengthError;
    if (formData.WorkLocation.length > maxLength)
      newErrors.WorkLocation = lengthError;
    if (formData["Account.Email"].length > maxLength)
      newErrors["Account.Email"] = lengthError;
    if (formData["Account.FullName"].length > maxLength)
      newErrors["Account.FullName"] = lengthError;
    if (formData["Account.PhoneNumber"].length > maxLength)
      newErrors["Account.PhoneNumber"] = lengthError;
    if (formData["Account.Password"].length > maxLength)
      newErrors["Account.Password"] = lengthError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      createEmployee(formDataToSend, {
        onSuccess: () => {
          toast({
            title: t("success.title"),
            description: t("success.description"),
          });
          onClose();
        },
        onError: () => {
          toast({
            title: t("error.title"),
            description: t("error.description"),
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Addemployee.title")}</DialogTitle>
          <DialogDescription>{t("Addemployee.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase">
            {t("Addemployee.sections.employeeInfo")}
          </h4>
          {/* Position + Department */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Position">
                {t("Addemployee.fields.position")} *
              </Label>
              <Input
                id="Position"
                value={formData.Position}
                onChange={(e) => handleInputChange("Position", e.target.value)}
                placeholder={t("Addemployee.placeholders.position")}
                maxLength={28}
                className={errors.Position ? "border-destructive" : ""}
              />
              {errors.Position && (
                <p className="text-sm text-destructive">{errors.Position}</p>
              )}
            </div>
            <div>
              <Label htmlFor="Department">
                {t("Addemployee.fields.department")} *
              </Label>
              <Input
                id="Department"
                value={formData.Department}
                onChange={(e) =>
                  handleInputChange("Department", e.target.value)
                }
                placeholder={t("Addemployee.placeholders.department")}
                maxLength={28}
                className={errors.Department ? "border-destructive" : ""}
              />
              {errors.Department && (
                <p className="text-sm text-destructive">{errors.Department}</p>
              )}
            </div>
          </div>
          {/* WorkLocation + BaseSalary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="WorkLocation">
                {t("Addemployee.fields.workLocation")} *
              </Label>
              <Input
                id="WorkLocation"
                value={formData.WorkLocation}
                onChange={(e) =>
                  handleInputChange("WorkLocation", e.target.value)
                }
                placeholder={t("Addemployee.placeholders.workLocation")}
                maxLength={28}
                className={errors.WorkLocation ? "border-destructive" : ""}
              />
              {errors.WorkLocation && (
                <p className="text-sm text-destructive">
                  {errors.WorkLocation}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="BaseSalary">
                {t("Addemployee.fields.baseSalary")} *
              </Label>
              <Input
                id="BaseSalary"
                type="number"
                value={formData.BaseSalary}
                onChange={(e) =>
                  handleInputChange(
                    "BaseSalary",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder={t("Addemployee.placeholders.baseSalary")}
                className={errors.BaseSalary ? "border-destructive" : ""}
              />
              {errors.BaseSalary && (
                <p className="text-sm text-destructive">{errors.BaseSalary}</p>
              )}
            </div>
          </div>

          <h4 className="font-semibold text-sm text-muted-foreground uppercase">
            {t("Addemployee.sections.accountInfo")}
          </h4>
          {/* Email + FullName */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Account.Email">
                {t("Addemployee.fields.email")} *
              </Label>
              <Input
                id="Account.Email"
                value={formData["Account.Email"]}
                onChange={(e) =>
                  handleInputChange("Account.Email", e.target.value)
                }
                placeholder={t("Addemployee.placeholders.email")}
                className={errors["Account.Email"] ? "border-destructive" : ""}
              />
              {errors["Account.Email"] && (
                <p className="text-sm text-destructive">
                  {errors["Account.Email"]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="Account.FullName">
                {t("Addemployee.fields.fullName")} *
              </Label>
              <Input
                id="Account.FullName"
                value={formData["Account.FullName"]}
                onChange={(e) =>
                  handleInputChange("Account.FullName", e.target.value)
                }
                placeholder={t("Addemployee.placeholders.fullName")}
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
          {/* DateOfBirth + Gender */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Account.DateOfBirth">
                {t("Addemployee.fields.dob")} *
              </Label>
              <Input
                id="Account.DateOfBirth"
                type="date"
                value={formData["Account.DateOfBirth"]}
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
            <div>
              <Label htmlFor="Account.Gender">
                {t("Addemployee.fields.gender")} *
              </Label>
              <Select
                value={formData["Account.Gender"]}
                onValueChange={(value) =>
                  handleInputChange("Account.Gender", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Addemployee.placeholders.gender")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">
                    {t("Addemployee.gender.male")}
                  </SelectItem>
                  <SelectItem value="Female">
                    {t("Addemployee.gender.female")}
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
          {/* Phone + Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Account.PhoneNumber">
                {t("Addemployee.fields.phone")} *
              </Label>
              <Input
                id="Account.PhoneNumber"
                value={formData["Account.PhoneNumber"]}
                onChange={(e) =>
                  handleInputChange("Account.PhoneNumber", e.target.value)
                }
                placeholder={t("Addemployee.placeholders.phone")}
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
            <div>
              <Label htmlFor="Account.Password">
                {t("Addemployee.fields.password")} *
              </Label>
              <div className="relative">
                <Input
                  id="Account.Password"
                  type={showPassword ? "text" : "password"}
                  value={formData["Account.Password"]}
                  onChange={(e) =>
                    handleInputChange("Account.Password", e.target.value)
                  }
                  placeholder={t("Addemployee.placeholders.password")}
                  className={
                    errors["Account.Password"] ? "border-destructive" : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Addemployee.actions.back")}
            </Button>
            <Button type="submit">
              {t("Addemployee.actions.addEmployee")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
