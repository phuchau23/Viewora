"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Download, Shield } from "lucide-react";
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
import { currentUser, hasEmployeeAccess } from "@/lib/data";
import { EmployeesTable } from "./components/employees-table";
import { EmployeeFormModal } from "./components/employee-form-modal";
import { EmployeeDetailsModal } from "./components/employee-details-modal";
import {
  useGetEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEmployees";
import { Employee } from "@/lib/api/service/fetchEmployees";
import { CreateEmployeeModal } from "./components/createEmployee";
import { EditEmployeeModal } from "./components/editEmployee";
import { exportToCSV } from "@/utils/export/exportToCSV";

export default function EmployeesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Bắt đầu từ trang 1 (0-based index)
    pageSize: 10,
  });

  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useGetEmployees(pagination.pageIndex + 1, pagination.pageSize);

  useEffect(() => {
    console.log(
      "Pagination changed:",
      pagination.pageIndex + 1,
      "Total Pages:",
      employees?.data?.totalPages
    );
    if (
      employees?.data?.totalPages &&
      pagination.pageIndex >= employees.data.totalPages
    ) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [employees?.data?.totalPages, pagination.pageIndex, setPagination]);

  const { mutate: createEmployee } = useCreateEmployee();
  const { mutate: updateEmployee } = useUpdateEmployee();
  const { mutate: deleteEmployee } = useDeleteEmployee();
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

  const handleCreateEmployee = (data: any) => {
    createEmployee(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        toast({
          title: "Employee Added",
          description: "New employee has been successfully added.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add employee.",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditEmployee = (data: any) => {
    if (!selectedEmployee) return;
    updateEmployee(
      { id: selectedEmployee.id, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
          toast({
            title: "Employee Updated",
            description: `${selectedEmployee.account.fullName} has been successfully updated.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update employee.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    deleteEmployee(selectedEmployee.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast({
          title: "Employee Deleted",
          description: `${selectedEmployee.account.fullName} has been successfully deleted.`,
          variant: "destructive",
        });
        setSelectedEmployee(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete employee.",
          variant: "destructive",
        });
      },
    });
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
          <Button
            variant="outline"
            onClick={() => {
              if (!employees?.data?.items?.length) return;

              // Export CSV
              exportToCSV(
                "employees.csv",
                ["Full Name", "Email", "Role", "Status"],
                employees.data.items,
                (emp) => [
                  emp.account.fullName,
                  emp.account.email,
                  emp.account.role,
                  emp.isActive ? "Active" : "Inactive",
                ]
              );
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

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
            data={employees?.data?.items ?? []}
            onView={handleViewDetails}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={employees?.data?.totalPages ?? 1}
          />
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <CreateEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
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
                {selectedEmployee?.account.fullName}
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
