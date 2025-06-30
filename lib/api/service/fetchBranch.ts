import apiService from "../core";

export interface Branch {
    id: string;
    name: string;
    totalRoom: number;
    address: string;
    phoneNumber: string;
    imageUrl: string;
    status: "Active" | "Inactive"; 
    createdAt: string; 
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