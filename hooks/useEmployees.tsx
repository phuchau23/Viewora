import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EmployeeService,
  EmployeeApiResponse,
  CreateEmployeeRequest,
} from "@/lib/api/service/fetchEmployees";

export const useEmployees = (pageIndex = 1, pageSize = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees", pageIndex, pageSize],
    queryFn: () => EmployeeService.getEmployees(pageIndex, pageSize),
    select: (response: EmployeeApiResponse) => ({
      employees: response.data.items,
      pagination: {
        totalItems: response.data.totalItems,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        pageSize: response.data.pageSize,
        hasPreviousPage: response.data.hasPreviousPage,
        hasNextPage: response.data.hasNextPage,
      },
    }),
  });

  return {
    employees: data?.employees || [],
    pageSize: data?.pagination.pageSize,
    totalPage: data?.pagination.totalPages,
    currentPage: data?.pagination.currentPage,
    isLoading,
    isError: !!error,
    error,
  };
};

export function useCreateEmployee() {
  const { mutate, mutateAsync, isError, isSuccess, isPending, data, error } =
    useMutation<EmployeeApiResponse, Error, CreateEmployeeRequest>({
      mutationFn: (formData) => EmployeeService.createEmployee(formData),
    });

  return {
    mutate,
    mutateAsync,
    isError,
    isSuccess,
    isPending,
    data,
    error,
  };
}
