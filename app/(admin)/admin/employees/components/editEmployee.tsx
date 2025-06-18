'use client';

import type React from "react";
import { useState } from "react";
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
import { useUpdateEmployee } from "@/hooks/useEmployees";
interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: Employee | null;
}

export function EditEmployeeModal({ isOpen, onClose, onSubmit, initialData }: EditEmployeeModalProps) {
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
    },
  });

  const { mutate: updateEmployee } = useUpdateEmployee();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployee({ id: initialData!.id, data: formData });
    onClose();
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

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update employee information.</DialogDescription>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit">Update Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}