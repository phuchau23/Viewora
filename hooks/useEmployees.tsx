'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EmployeeService,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Employee
} from "@/lib/api/service/fetchEmployees";

// Lấy danh sách nhân viên
export function useGetEmployees(pageIndex = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["employees", pageIndex, pageSize],
    queryFn: () => EmployeeService.getEmployees(pageIndex, pageSize),
  });
}

// Lấy nhân viên theo ID
export function useGetEmployeeById(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => EmployeeService.getEmployeeById(id),
    enabled: !!id,
  });
}

// Tạo nhân viên mới
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeRequest | FormData) => EmployeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Cập nhật thông tin nhân viên
export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest | FormData }) =>
      EmployeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Xóa nhân viên
export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => EmployeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Cập nhật trạng thái hoạt động
export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => EmployeeService.updateEmployeeStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

