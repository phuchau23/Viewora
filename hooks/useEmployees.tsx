import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EmployeeService,
  EmployeeApiResponse,
  CreateEmployeeRequest,
} from "@/lib/api/service/fetchEmployees";

export const useEmployees = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: () => EmployeeService.getEmployees(),
    select: (data: EmployeeApiResponse) => ({
      data: data.data,
      status: data.statusCode,
    }),
  });

  return {
    data,
    isError: error !== null,
    isLoading,
    error,
  };
};

export function useCreateEmployee() {
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: (formData: FormData) => EmployeeService.createEmployee(formData),
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}
