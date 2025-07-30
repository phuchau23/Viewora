"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Employee } from "@/lib/api/service/fetchEmployees";

interface EmployeesTableAdvancedProps {
  data: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onBulkDelete?: (employees: Employee[]) => void;
  onBulkStatusChange?: (
    employees: Employee[],
    status: "Active" | "Inactive"
  ) => void;
}

export function EmployeesTableAdvanced({
  data,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusChange,
}: EmployeesTableAdvancedProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      {
        accessorKey: "employeeId",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("employeeTable.employeeId")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm font-medium">
            {row.getValue("employeeId")}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "employeeName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("employeeTable.employeeName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {row
                  .getValue<string>("employeeName")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.getValue("employeeName")}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.account.fullName}
              </div>
            </div>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "identityCard",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("employeeTable.identityCard")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm">
            {row.getValue("identityCard")}
          </div>
        ),
        size: 130,
      },
      {
        accessorKey: "email",
        header: t("employeeTable.email"),
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("email")}</div>
        ),
        size: 200,
      },
      {
        accessorKey: "phoneNumber",
        header: t("employeeTable.phoneNumber"),
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.getValue("phoneNumber")}</div>
        ),
        size: 140,
      },
      {
        accessorKey: "address",
        header: t("employeeTable.address"),
        cell: ({ row }) => (
          <div
            className="text-sm max-w-[200px] truncate"
            title={row.getValue("address")}
          >
            {row.getValue("address")}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "role",
        header: t("employeeTable.role"),
        cell: ({ row }) => (
          <Badge variant={getRoleColor(row.getValue("role"))}>
            {row.getValue("role")}
          </Badge>
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: t("employeeTable.status"),
        cell: ({ row }) => (
          <Badge variant={getStatusColor(row.getValue("status"))}>
            {row.getValue("status")}
          </Badge>
        ),
        size: 100,
      },
      {
        id: "actions",
        header: t("employeeTable.actions"),
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(employee)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(employee)}>
                    <Eye className="mr-2 h-4 w-4" />{" "}
                    {t("employeeTable.viewDetails")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(employee)}>
                    <Edit className="mr-2 h-4 w-4" />{" "}
                    {t("employeeTable.editEmployee")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(employee)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />{" "}
                    {t("employeeTable.deleteEmployee")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 120,
      },
    ],
    [t, onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, globalFilter, rowSelection, pagination },
  });

  const selectedEmployees = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("employeeTable.searchPlaceholder")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="pl-8 max-w-sm"
            />
          </div>
          <Select
            value={
              (table.getColumn("role")?.getFilterValue() as string[])?.join(
                ","
              ) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("role")
                ?.setFilterValue(value ? value.split(",") : undefined)
            }
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("employeeTable.roleFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("employeeTable.allRoles")}</SelectItem>
              <SelectItem value="Admin">{t("employeeTable.admin")}</SelectItem>
              <SelectItem value="Manager">
                {t("employeeTable.manager")}
              </SelectItem>
              <SelectItem value="Employee">
                {t("employeeTable.employee")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string[])?.join(
                ","
              ) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value ? value.split(",") : undefined)
            }
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("employeeTable.statusFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("employeeTable.allStatus")}
              </SelectItem>
              <SelectItem value="Active">
                {t("employeeTable.active")}
              </SelectItem>
              <SelectItem value="Inactive">
                {t("employeeTable.inactive")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {t("employeeTable.rowCount", {
              count: table.getFilteredRowModel().rows.length,
              total: table.getCoreRowModel().rows.length,
            })}
          </span>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedEmployees.length > 0 && (
        <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {t("employeeTable.selectedCount", {
              count: selectedEmployees.length,
            })}
          </span>
          <div className="flex items-center space-x-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkStatusChange?.(selectedEmployees, "Active")}
            >
              <UserCheck className="mr-2 h-4 w-4" />{" "}
              {t("employeeTable.activate")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onBulkStatusChange?.(selectedEmployees, "Inactive")
              }
            >
              <UserX className="mr-2 h-4 w-4" /> {t("employeeTable.deactivate")}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />{" "}
              {t("employeeTable.exportSelected")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete?.(selectedEmployees)}
            >
              <Trash2 className="mr-2 h-4 w-4" />{" "}
              {t("employeeTable.deleteSelected")}
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("employeeTable.noEmployeesFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {t("employeeTable.rowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t("employeeTable.page", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t("employeeTable.goToFirstPage")}
              </span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t("employeeTable.goToPreviousPage")}
              </span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t("employeeTable.goToNextPage")}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t("employeeTable.goToLastPage")}</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
