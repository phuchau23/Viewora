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
import { Plus, Download } from "lucide-react";
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
import { EmployeesTable } from "./components/employees-table";
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
import { useTranslation } from "react-i18next";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useGetEmployees(pagination.pageIndex + 1, pagination.pageSize);

  const { mutate: createEmployee } = useCreateEmployee();
  const { mutate: updateEmployee } = useUpdateEmployee();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const { toast } = useToast();

  const handleEditEmployee = (data: any) => {
    if (!selectedEmployee) return;
    updateEmployee(
      { id: selectedEmployee.id, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
          toast({
            title: t("Employeetoast.updatedTitle"),
            description: t("Employeetoast.updatedDesc", {
              name: selectedEmployee.account.fullName,
            }),
          });
        },
        onError: () => {
          toast({
            title: t("Employeetoast.errorTitle"),
            description: t("Employeetoast.updateError"),
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
          title: t("Employeetoast.deletedTitle"),
          description: t("Employeetoast.deletedDesc", {
            name: selectedEmployee.account.fullName,
          }),
          variant: "destructive",
        });
        setSelectedEmployee(null);
      },
      onError: () => {
        toast({
          title: t("Employeetoast.errorTitle"),
          description: t("Employeetoast.deleteError"),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Employeetitle")}
          </h1>
          <p className="text-muted-foreground">{t("Employeedescription")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              if (!employees?.data?.items?.length) return;
              exportToCSV(
                "employees.csv",
                [
                  t("csv.fullName"),
                  t("csv.email"),
                  t("csv.role"),
                  t("csv.Employeestatus"),
                ],
                employees.data.items,
                (emp) => [
                  emp.account.fullName,
                  emp.account.email,
                  emp.account.role,
                  emp.isActive
                    ? t("Employeestatus.active")
                    : t("Employeestatus.inactive"),
                ]
              );
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addEmployee")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recordsTitle")}</CardTitle>
          <CardDescription>{t("recordsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesTable
            data={employees?.data?.items ?? []}
            onView={(e) => {
              setSelectedEmployee(e);
              setIsDetailsModalOpen(true);
            }}
            onEdit={(e) => {
              setSelectedEmployee(e);
              setIsEditModalOpen(true);
            }}
            onDelete={(e) => {
              setSelectedEmployee(e);
              setIsDeleteDialogOpen(true);
            }}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={employees?.data?.totalPages ?? 1}
          />
        </CardContent>
      </Card>

      <CreateEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
        initialData={selectedEmployee}
      />

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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDesc", { name: selectedEmployee?.account.fullName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEmployee(null)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
