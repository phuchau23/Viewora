import {
  RoleService,
  RoleApiResponse,
  RoleCreateRequest,
} from "@/lib/api/service/fetchRole";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoles() {
  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => RoleService.getAllRoles(),
    select: (data: RoleApiResponse) => ({
      roles: data.data,
      status: data.statusCode,
    }),
  });
  return {
    isError,
    isLoading,
    error,
    roles: data?.roles,
  };
}
export function useCreateRole() {
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: (formData: FormData) => RoleService.createRole(formData),
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}
export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: (roleId: number) => RoleService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
  
  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}
