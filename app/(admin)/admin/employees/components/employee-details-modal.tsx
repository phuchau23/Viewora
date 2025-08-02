"use client";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User,
  Edit,
  Shield,
  Users,
  Building,
} from "lucide-react";
import { Employee } from "@/lib/api/service/fetchEmployees";

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: () => void;
}

export function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
  onEdit,
}: EmployeeDetailsModalProps) {
  const { t } = useTranslation();

  if (!employee) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4" />;
      case "Manager":
        return <Building className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Manager":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("employeeDetails.title")}</DialogTitle>
          <DialogDescription>
            {t("employeeDetails.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {employee.account.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                {employee.account.fullName}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={getRoleColor(employee.account.role)}
                  className="flex items-center space-x-1"
                >
                  {getRoleIcon(employee.account.role)}
                  <span>
                    {t(
                      `employeeDetails.role.${employee.account.role.toLowerCase()}`
                    )}
                  </span>
                </Badge>
                <Badge variant={getStatusColor(employee.account.role)}>
                  {t(`employeeDetails.status.active`)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("employeeDetails.sections.accountInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.account")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.position")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.position}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("employeeDetails.sections.personalInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.fullName")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.dateOfBirth")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.dateOfBirth}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.gender")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.department")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.workLocation")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.workLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.salary")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.baseSalary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("employeeDetails.sections.contactInfo")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.email")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("employeeDetails.fields.phoneNumber")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.account.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {t("employeeDetails.buttons.edit")}
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            {t("employeeDetails.buttons.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
