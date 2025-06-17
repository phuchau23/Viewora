import apiService from "../core";

export interface Branch {
    id: string;
    name: string;
    totalRoom: number;
    address: string;
    phoneNumber: string;
    status: "Active" | "Inactive"; // Nếu chỉ có "Active" thì có thể đơn giản là string
    createdAt: string; // ISO date string, có thể dùng Date nếu bạn parse
  }
  
  export interface BranchResponse {
    code: number;
    statusCode: string;
    message: string;
    data: Branch[];
  }

  export const BranchService = {
    getAllBranch: async () => {
      const response = await apiService.get<BranchResponse>("/branchs");
      return response.data;
    },
  };