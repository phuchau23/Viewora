import UserService from "@/lib/api/service/fetchUser";
import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/lib/api/service/fetchUser";

export function useUsers() {
  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUser(),
    select: (data: UserResponse) => ({
      users: data.data,
      status: data.statusCode,
    }),
  });
  return {
    isError,
    isLoading,
    error,
    users: data?.users,
  };
}
