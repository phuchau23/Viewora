import { useQuery } from "@tanstack/react-query";
import { BranchService } from "@/lib/api/service/fetchBranch";

export const useBranch = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["branches"],
    queryFn: () => BranchService.getAllBranch(),
  });

  return {
    branches: data?.data || [],
    isLoading,
    error,
  };
};
