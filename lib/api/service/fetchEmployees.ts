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
    code: number,
    statusCode: string,
    message: string,
    data: Employee[]
}

export interface CreateEmployeeRequest {
    position: string;
    accountId: number;
    department: string;
    workLocation: string;
    baseSalary: number;
}

export const EmployeeService = {
    async getEmployees(): Promise<EmployeeApiResponse> {
        const response = await apiService.get<EmployeeApiResponse>('/employees');
        return response.data;
    },

    createEmployee: async (formData: FormData) => {
        const response = await apiService.post<CreateEmployeeRequest>("/employees", formData);
        return response.data;
    },

    deleteEmployee: async (id: number) => {
        const response = await apiService.delete(`/employees/${id}`);
        return response.data;
    }

}