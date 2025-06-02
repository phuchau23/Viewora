import apiService from "../core";

export interface User {
    accountId: number;
    roleId: number | null;
    username: string;
    password: string;
    fullName: string;
    email: string;
    dateOfBirth: string | null;
    phoneNumber: string;
    avatar: string;
    identityCard: string;
    address: string;
    gender: number; // Represents Gender enum (e.g., 0 for Male, 1 for Female)
    createdAt: string | null;
    updatedAt: string | null;
    isVerified: boolean;
    isActive: boolean;
    role: any | null; // Use specific Role interface if defined
    employee: any | null; // Use specific Employee interface if defined
}

export interface UserResponse {
    code: number;
    statusCode: string;
    message: string;
    data: User[];
}

export const UserService = {
    //get User
    getUser: async () => {
        const response = await apiService.get<UserResponse>("/users");
        return response.data;
    },
}

export default UserService;