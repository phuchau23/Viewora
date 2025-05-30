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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Eye, EyeOff } from "lucide-react";
import { Employee } from "@/lib/data";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: any) => boolean;
  title: string;
  submitText: string;
  mode: "add" | "edit";
  initialData?: Employee | null;
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  mode,
  initialData,
}: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    confirmPassword: "",
    employeeName: "",
    identityCard: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    sex: "Male" as "Male" | "Female",
    role: "Employee" as Employee["role"],
    status: "Active" as Employee["status"],
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        account: initialData.account,
        password: "", // Don't pre-fill password for security
        confirmPassword: "",
        employeeName: initialData.employeeName,
        identityCard: initialData.identityCard,
        email: initialData.email,
        phoneNumber: initialData.phoneNumber,
        address: initialData.address,
        dateOfBirth: initialData.dateOfBirth,
        sex: initialData.sex,
        role: initialData.role,
        status: initialData.status,
        image: initialData.image || "",
      });
    } else {
      setFormData({
        account: "",
        password: "",
        confirmPassword: "",
        employeeName: "",
        identityCard: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        sex: "Male",
        role: "Employee",
        status: "Active",
        image: "",
      });
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // AC-02: Validate all mandatory fields are filled
    if (!formData.employeeName.trim())
      newErrors.employeeName = "Employee Name is required";
    if (!formData.identityCard.trim())
      newErrors.identityCard = "Identity Card is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";

    if (mode === "add") {
      if (!formData.account.trim()) newErrors.account = "Account is required";
      if (!formData.password.trim())
        newErrors.password = "Password is required";
      if (!formData.confirmPassword.trim())
        newErrors.confirmPassword = "Confirm Password is required";
    }

    // AC-02: Password and Confirm Password must match
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password and Confirm Password must match";
    }

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Field length validation (max 28 characters as per AC-01)
    const maxLength = 28;
    if (formData.account.length > maxLength)
      newErrors.account = `Account must be ${maxLength} characters or less`;
    if (formData.password.length > maxLength)
      newErrors.password = `Password must be ${maxLength} characters or less`;
    if (formData.employeeName.length > maxLength)
      newErrors.employeeName = `Name must be ${maxLength} characters or less`;
    if (formData.identityCard.length > maxLength)
      newErrors.identityCard = `Identity Card must be ${maxLength} characters or less`;
    if (formData.email.length > maxLength)
      newErrors.email = `Email must be ${maxLength} characters or less`;
    if (formData.phoneNumber.length > maxLength)
      newErrors.phoneNumber = `Phone must be ${maxLength} characters or less`;
    if (formData.address.length > maxLength)
      newErrors.address = `Address must be ${maxLength} characters or less`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const success = onSubmit(formData);
      if (success) {
        onClose();
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBack = () => {
    onClose(); // AC-05: Return to previous screen without saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter employee personal and account details to add them to the system."
              : "Update employee information. Account field cannot be modified."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AC-01: Image Upload Button */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {formData.employeeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account">Account *</Label>
                <Input
                  id="account"
                  value={formData.account}
                  onChange={(e) => handleInputChange("account", e.target.value)}
                  placeholder="Enter account name"
                  maxLength={28}
                  disabled={mode === "edit"} // AC-01: Account non-editable in edit mode
                  className={errors.account ? "border-destructive" : ""}
                />
                {errors.account && (
                  <p className="text-sm text-destructive">{errors.account}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter password"
                    maxLength={28}
                    className={errors.password ? "border-destructive" : ""}
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
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm password"
                    maxLength={28}
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) =>
                    handleInputChange("employeeName", e.target.value)
                  }
                  placeholder="Enter full name"
                  maxLength={28}
                  className={errors.employeeName ? "border-destructive" : ""}
                />
                {errors.employeeName && (
                  <p className="text-sm text-destructive">
                    {errors.employeeName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="identityCard">Identity Card *</Label>
                <Input
                  id="identityCard"
                  value={formData.identityCard}
                  onChange={(e) =>
                    handleInputChange("identityCard", e.target.value)
                  }
                  placeholder="Enter identity card number"
                  maxLength={28}
                  className={errors.identityCard ? "border-destructive" : ""}
                />
                {errors.identityCard && (
                  <p className="text-sm text-destructive">
                    {errors.identityCard}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={errors.dateOfBirth ? "border-destructive" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Sex *</Label>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="male"
                      checked={formData.sex === "Male"}
                      onCheckedChange={() => handleInputChange("sex", "Male")}
                    />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="female"
                      checked={formData.sex === "Female"}
                      onCheckedChange={() => handleInputChange("sex", "Female")}
                    />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  maxLength={28}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
                  maxLength={28}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                maxLength={28}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit">{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
