import { useQuery } from "@tanstack/react-query";
import {
  EmployeeService,
  EmployeeApiResponse,
} from "@/lib/api/service/fetchEmployees";

export const useEmployees = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: () => EmployeeService.getEmployees(),
    select: (data: EmployeeApiResponse) => ({
      employees: data.data,
      status: data.statusCode,
    }),
  });

  return {
    isError: error !== null,
    isLoading,
    error,
    employees: data?.employees,
  };
};
