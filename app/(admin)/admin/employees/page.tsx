"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Download,
  Users,
  UserCheck,
  UserX,
  Shield,
  Building,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/lib/data";
import { sampleEmployees, currentUser, hasEmployeeAccess } from "@/lib/data";
import { EmployeesTable } from "./components/employees-table";
import { EmployeeFormModal } from "./components/employee-form-modal";
import { EmployeeDetailsModal } from "./components/employee-details-modal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const { toast } = useToast();

  // Role-based access control
  if (!hasEmployeeAccess(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center">
              Only Admins and Managers can access employee management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddEmployee = (
    employeeData: Omit<
      Employee,
      "id" | "employeeId" | "createdDate" | "lastLogin"
    >
  ) => {
    // Check if account already exists (AC-04)
    const accountExists = employees.some(
      (emp) => emp.account === employeeData.account
    );
    if (accountExists) {
      toast({
        title: "Account Already Exists",
        description:
          "The inputted account is already existed, please choose another account name",
        variant: "destructive",
      });
      return false;
    }

    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map((e) => e.id)) + 1,
      employeeId: `EMP${String(
        Math.max(...employees.map((e) => e.id)) + 1
      ).padStart(3, "0")}`,
      createdDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };

    setEmployees([...employees, newEmployee]);
    setIsAddModalOpen(false);
    toast({
      title: "Employee Added",
      description: `${newEmployee.employeeName} has been successfully added.`,
    });
    return true;
  };

  const handleEditEmployee = (
    employeeData: Omit<
      Employee,
      "id" | "employeeId" | "createdDate" | "lastLogin" | "account"
    >
  ) => {
    if (!selectedEmployee) return false;

    const updatedEmployee: Employee = {
      ...employeeData,
      id: selectedEmployee.id,
      employeeId: selectedEmployee.employeeId,
      account: selectedEmployee.account, // Account is non-editable
      createdDate: selectedEmployee.createdDate,
      lastLogin: selectedEmployee.lastLogin,
    };

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    toast({
      title: "Employee Updated",
      description: `${updatedEmployee.employeeName} has been successfully updated.`,
    });
    return true;
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Employee Deleted",
      description: `${selectedEmployee.employeeName} has been successfully deleted.`,
      variant: "destructive",
    });
    setSelectedEmployee(null);
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const employeeStats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "Active").length,
    inactive: employees.filter((e) => e.status === "Inactive").length,
    admins: employees.filter((e) => e.role === "Admin").length,
    managers: employees.filter((e) => e.role === "Manager").length,
    employees: employees.filter((e) => e.role === "Employee").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage movie theater employee records with advanced table features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Employee Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats.total}</div>
            <p className="text-xs text-muted-foreground">All employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employeeStats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {((employeeStats.active / employeeStats.total) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {employeeStats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">
              {((employeeStats.inactive / employeeStats.total) * 100).toFixed(
                0
              )}
              %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {employeeStats.admins}
            </div>
            <p className="text-xs text-muted-foreground">System admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {employeeStats.managers}
            </div>
            <p className="text-xs text-muted-foreground">Department heads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {employeeStats.employees}
            </div>
            <p className="text-xs text-muted-foreground">Regular staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Table with TanStack Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Records</CardTitle>
          <CardDescription>
            Advanced table with sorting, filtering, pagination, and search
            capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesTable
            data={employees}
            onView={handleViewDetails}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEmployee}
        title="Add New Employee"
        submitText="Add Employee"
        mode="add"
      />

      {/* Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
        title="Edit Employee"
        submitText="Update Employee"
        mode="edit"
        initialData={selectedEmployee}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          handleDeleteClick(selectedEmployee!);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedEmployee?.employeeName}
              </span>
              ? This action cannot be undone and will permanently remove all
              employee data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEmployee(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
