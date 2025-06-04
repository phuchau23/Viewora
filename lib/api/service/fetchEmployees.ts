export interface Employee {
    id: number,
    position: string,
    hireDate: string,
    department: string,
    workLocation: string,
    isActive: boolean,
    baseSalary: number,
    accountId: number
}

export interface EmployeeApiResponse {
    code: number,
    statusCode: string,
    message: string,
    data: Employee[]
}

export const EmployeeService = {
    async getEmployees(): Promise<EmployeeApiResponse> {
        const response = await fetch('/api/employees');
        return response.json();
    }
}