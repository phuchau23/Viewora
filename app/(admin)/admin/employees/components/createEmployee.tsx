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

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
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

    // Validate các trường bắt buộc
    if (!formData.Position.trim()) newErrors.Position = "Position is required";
    if (!formData.Department.trim()) newErrors.Department = "Department is required";
    if (!formData.WorkLocation.trim()) newErrors.WorkLocation = "Work Location is required";
    if (formData.BaseSalary <= 0) newErrors.BaseSalary = "Base Salary must be positive";
    if (!formData["Account.Email"].trim()) newErrors["Account.Email"] = "Email is required";
    if (!formData["Account.FullName"].trim()) newErrors["Account.FullName"] = "Full Name is required";
    if (!formData["Account.DateOfBirth"]) newErrors["Account.DateOfBirth"] = "Date of Birth is required";
    if (!formData["Account.Gender"].trim()) newErrors["Account.Gender"] = "Gender is required";
    if (!formData["Account.PhoneNumber"].trim()) newErrors["Account.PhoneNumber"] = "Phone Number is required";
    if (!formData["Account.Password"].trim()) newErrors["Account.Password"] = "Password is required";

    // Validate định dạng email
    if (formData["Account.Email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["Account.Email"])) {
      newErrors["Account.Email"] = "Please enter a valid email address";
    }

    // Validate độ dài tối đa (28 ký tự)
    const maxLength = 28;
    if (formData.Position.length > maxLength) newErrors.Position = `Position must be ${maxLength} characters or less`;
    if (formData.Department.length > maxLength) newErrors.Department = `Department must be ${maxLength} characters or less`;
    if (formData.WorkLocation.length > maxLength) newErrors.WorkLocation = `Work Location must be ${maxLength} characters or less`;
    if (formData["Account.Email"].length > maxLength) newErrors["Account.Email"] = `Email must be ${maxLength} characters or less`;
    if (formData["Account.FullName"].length > maxLength) newErrors["Account.FullName"] = `Full Name must be ${maxLength} characters or less`;
    if (formData["Account.PhoneNumber"].length > maxLength) newErrors["Account.PhoneNumber"] = `Phone must be ${maxLength} characters or less`;
    if (formData["Account.Password"].length > maxLength) newErrors["Account.Password"] = `Password must be ${maxLength} characters or less`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append("Position", formData.Position);
      formDataToSend.append("Department", formData.Department);
      formDataToSend.append("WorkLocation", formData.WorkLocation);
      formDataToSend.append("BaseSalary", formData.BaseSalary.toString());
      formDataToSend.append("Account.Email", formData["Account.Email"]);
      formDataToSend.append("Account.FullName", formData["Account.FullName"]);
      formDataToSend.append("Account.DateOfBirth", formData["Account.DateOfBirth"]);
      formDataToSend.append("Account.Gender", formData["Account.Gender"]);
      formDataToSend.append("Account.PhoneNumber", formData["Account.PhoneNumber"]);
      formDataToSend.append("Account.Password", formData["Account.Password"]);

      createEmployee(formDataToSend, {
        onSuccess: () => {
          toast({
            title: "Employee Added",
            description: "New employee has been successfully added.",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to add employee.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter employee personal and account details to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Employee Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Position">Position *</Label>
                <Input
                  id="Position"
                  value={formData.Position}
                  onChange={(e) => handleInputChange("Position", e.target.value)}
                  placeholder="Enter position"
                  maxLength={28}
                  className={errors.Position ? "border-destructive" : ""}
                />
                {errors.Position && (
                  <p className="text-sm text-destructive">{errors.Position}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Department">Department *</Label>
                <Input
                  id="Department"
                  value={formData.Department}
                  onChange={(e) => handleInputChange("Department", e.target.value)}
                  placeholder="Enter department"
                  maxLength={28}
                  className={errors.Department ? "border-destructive" : ""}
                />
                {errors.Department && (
                  <p className="text-sm text-destructive">{errors.Department}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="WorkLocation">Work Location *</Label>
                <Input
                  id="WorkLocation"
                  value={formData.WorkLocation}
                  onChange={(e) => handleInputChange("WorkLocation", e.target.value)}
                  placeholder="Enter work location"
                  maxLength={28}
                  className={errors.WorkLocation ? "border-destructive" : ""}
                />
                {errors.WorkLocation && (
                  <p className="text-sm text-destructive">{errors.WorkLocation}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="BaseSalary">Base Salary *</Label>
                <Input
                  id="BaseSalary"
                  type="number"
                  value={formData.BaseSalary}
                  onChange={(e) => handleInputChange("BaseSalary", parseFloat(e.target.value) || 0)}
                  placeholder="Enter base salary"
                  className={errors.BaseSalary ? "border-destructive" : ""}
                />
                {errors.BaseSalary && (
                  <p className="text-sm text-destructive">{errors.BaseSalary}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.Email">Email *</Label>
                <Input
                  id="Account.Email"
                  value={formData["Account.Email"]}
                  onChange={(e) => handleInputChange("Account.Email", e.target.value)}
                  placeholder="Enter email"
                  maxLength={28}
                  className={errors["Account.Email"] ? "border-destructive" : ""}
                />
                {errors["Account.Email"] && (
                  <p className="text-sm text-destructive">{errors["Account.Email"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.FullName">Full Name *</Label>
                <Input
                  id="Account.FullName"
                  value={formData["Account.FullName"]}
                  onChange={(e) => handleInputChange("Account.FullName", e.target.value)}
                  placeholder="Enter full name"
                  maxLength={28}
                  className={errors["Account.FullName"] ? "border-destructive" : ""}
                />
                {errors["Account.FullName"] && (
                  <p className="text-sm text-destructive">{errors["Account.FullName"]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.DateOfBirth">Date of Birth *</Label>
                <Input
                  id="Account.DateOfBirth"
                  type="date"
                  value={formData["Account.DateOfBirth"]}
                  onChange={(e) => handleInputChange("Account.DateOfBirth", e.target.value)}
                  className={errors["Account.DateOfBirth"] ? "border-destructive" : ""}
                />
                {errors["Account.DateOfBirth"] && (
                  <p className="text-sm text-destructive">{errors["Account.DateOfBirth"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.Gender">Gender *</Label>
                <Select
                  value={formData["Account.Gender"]}
                  onValueChange={(value) => handleInputChange("Account.Gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors["Account.Gender"] && (
                  <p className="text-sm text-destructive">{errors["Account.Gender"]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Account.PhoneNumber">Phone Number *</Label>
                <Input
                  id="Account.PhoneNumber"
                  value={formData["Account.PhoneNumber"]}
                  onChange={(e) => handleInputChange("Account.PhoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                  maxLength={28}
                  className={errors["Account.PhoneNumber"] ? "border-destructive" : ""}
                />
                {errors["Account.PhoneNumber"] && (
                  <p className="text-sm text-destructive">{errors["Account.PhoneNumber"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Account.Password">Password *</Label>
                <div className="relative">
                  <Input
                    id="Account.Password"
                    type={showPassword ? "text" : "password"}
                    value={formData["Account.Password"]}
                    onChange={(e) => handleInputChange("Account.Password", e.target.value)}
                    placeholder="Enter password"
                    maxLength={28}
                    className={errors["Account.Password"] ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors["Account.Password"] && (
                  <p className="text-sm text-destructive">{errors["Account.Password"]}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit">
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}