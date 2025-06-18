'use client';
import apiService from "../core";

export interface Account {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  avatar: string;
  identityCard: string;
  role: string;
}

export interface Employee {
  id: string;
  position: string;
  hireDate: string;
  department: string;
  workLocation: string;
  isActive: boolean;
  baseSalary: number;
  account: Account;
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
  Position: string;
  Department: string;
  WorkLocation: string;
  BaseSalary: number;
  "Account.Email": string;
  "Account.FullName": string;
  "Account.DateOfBirth": string;
  "Account.Gender": string;
  "Account.PhoneNumber": string;
  "Account.Password": string;
}

export interface CreateEmployeeResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Employee;
}

export interface UpdateEmployeeRequest extends Record<string, unknown> {
  Position?: string;
  Department?: string;
  WorkLocation?: string;
  BaseSalary?: number;
}


export const EmployeeService = {
  async getEmployees(pageIndex = 1, pageSize = 10): Promise<EmployeeApiResponse> {
    const response = await apiService.get<EmployeeApiResponse>(`/employees?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return response.data;
  },

  async createEmployee(data: CreateEmployeeRequest | FormData): Promise<CreateEmployeeResponse> {
    const response = await apiService.post<CreateEmployeeResponse>("/employees", data);
    return response.data;
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await apiService.get<{ data: Employee }>(`/employees/${id}`);
    return response.data.data;
  },

  async updateEmployee(id: string, data: UpdateEmployeeRequest | FormData): Promise<Employee> {
    const response = await apiService.put<{ data: Employee }>(`/employees/${id}`, data);
    return response.data.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await apiService.delete(`/employees/${id}`);
  },

  async updateEmployeeStatus(id: string ): Promise<Employee> {
    const response = await apiService.patch<{ data: Employee }>(`/employees/${id}/active`);
    return response.data.data;
  },
};
