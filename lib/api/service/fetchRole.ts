import apiService from "../core";

export interface Role {
    roleId: number;
    name: string;
    status: boolean;
    dateCreate: string ;
    description: string;
}

export interface RoleApiResponse {
    code: number;
    statusCode: number;
    message: string;
    data: Role[];
}


export interface RoleCreateRequest {
    name: string;
    description: string;
}

export interface RoleCreateResponse {
    code: number;
    statusCode: number;
    message: string;
    data: RoleCreate;
}

export interface RoleCreate {
    roleId: number;
    name: string;
    status: boolean;
    dateCreate: string ;
    description: string;
}

export interface RoleDeleteRequest {
    roleId: number;
}
export interface RoleDeleteResponse {
    code: number;
    statusCode: string;
    message: string;
    data: null;
}

export const RoleService = {

    getAllRoles: async () => {
        const response = await apiService.get<RoleApiResponse>("/roles");
        return response.data;
    },

    createRole: async (formData: FormData) => {
        const response = await apiService.post<RoleCreateResponse>("/roles", formData);
        return response.data;
    },

    deleteRole: async (roleId: number) => {
        const response = await apiService.delete<RoleDeleteResponse>(`/roles/${roleId}`);
        return response.data;
    },
}
  