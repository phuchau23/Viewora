import apiService from "../core";

export interface Role {
    id: string;
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
    id: string;
    name: string;
    status: boolean;
    dateCreate: string ;
    description: string;
}

export interface RoleDeleteRequest {
    id: string;
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

    deleteRole: async (id: string) => {
        const response = await apiService.delete<RoleDeleteResponse>(`/roles/${id}`);
        return response.data;
    },
}
  