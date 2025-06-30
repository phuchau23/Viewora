"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EmployeeService,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "@/lib/api/service/fetchEmployees";
import { useToast } from "@/hooks/use-toast";

// Lấy danh sách nhân viên
export function useGetEmployees(pageIndex = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["employees", pageIndex, pageSize],
    queryFn: () => EmployeeService.getEmployees(pageIndex, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}

// Lấy nhân viên theo ID
export function useGetEmployeeById(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => EmployeeService.getEmployeeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Tạo nhân viên mới
export function useCreateEmployee() {
  const { toast } = useToast();
const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, isPending, data } = useMutation({
    mutationFn: (data: CreateEmployeeRequest | FormData) =>
      EmployeeService.createEmployee(data), 
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Tạo nhân viên thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: error.message || "Tạo nhân viên thất bại",
        variant: "destructive",
      });
    },
  });

  return {
    mutate,
    isError,
    isSuccess,
    isPending,
    data,
  };
}

// Cập nhật thông tin nhân viên
export function useUpdateEmployee() {
  const { toast } = useToast();
const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeRequest | FormData;
    }) => EmployeeService.updateEmployee(id, data),
    onSuccess: () => {
       toast({
        title: "Thành công",
        description: "Cập nhật thông tin nhân viên thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: error.message || "Cập nhật thông tin nhân viên thất bại",
        variant: "destructive",
      });
    },
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}

// Xóa nhân viên
export function useDeleteEmployee() {
  const { toast } = useToast();
const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: (id: string) => EmployeeService.deleteEmployee(id),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Xóa nhân viên thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: error.message || "Xóa nhân viên thất bại",
        variant: "destructive",
      });
    },
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}

// Cập nhật trạng thái hoạt động
export function useUpdateEmployeeStatus() {
  const { toast } = useToast();
const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      EmployeeService.updateEmployeeStatus(id),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái hoạt động thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}
