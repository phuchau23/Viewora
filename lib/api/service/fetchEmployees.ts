import apiService from "../core";

export interface Employee {
    id: number,
    position: string,
    hireDate: string,
    department: string,
    workLocation: string,
    isActive: boolean,
    baseSalary: number,
    account: Account
}

export interface Account {
    accountId: number,
    email: string,
    fullName: string,
    phoneNumber: string,
    dateOfBirth: string,
    gender: string,
    address: string,
    avatar: string,
    identityCard: string,
    role: string
}

export interface EmployeeApiResponse {
    code: number;
    statusCode: string;
    message: string;
    data: {
      items: Employee[];
      totalItems: number;
      currentPage: number;
      totalPages: number;
      pageSize: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  }

  

  export interface CreateEmployeeRequest {
    position: string;
    department: string;
    workLocation: string;
    baseSalary: number;
    accountId: number;
    account: {
      email: string;
      fullName: string;
      dateOfBirth: string; // ISO format: yyyy-MM-dd
      gender: string;
      phoneNumber: string;
      password: string;
    };
  }


export const EmployeeService = {
    async getEmployees(pageIndex = 1, pageSize = 10): Promise<EmployeeApiResponse> {
        const response = await apiService.get<EmployeeApiResponse>(`/employees?pageIndex=${pageIndex}&pageSize=${pageSize}`);
        return response.data;
      },
      async createEmployee(data: CreateEmployeeRequest): Promise<EmployeeApiResponse> {
        const response = await apiService.post<EmployeeApiResponse>(
          "/employees",
          data,
          false // useJson = false => tự động chuyển thành FormData
        );
        return response.data;
      },
    // async deleteEmployee(id: number): Promise<EmployeeApiResponse> {
    //     const response = await apiService.delete(`/employees/${id}`);
    //     return response.data;
    // }

}