import apiService from "../core";

export interface Type{
    id: string;
    name: string;
    createdAt: Date
}
export interface TypeResponse{
    code: number;
    statusCode: string;
    message: string;
    data?: Type[];
}

export interface CreateTypeRequest {
    name: string;
}

export interface CreateTypeResponse {
    code: number;
    statusCode: string;
    message: string;
    data?: [];
}

export interface DeleteTypeRequest {
    id: number;
}

export interface DeleteTypeResponse {
    code: number;
    statusCode: string;
    message: string;
    data?: [];
}

export const TypeService = {
    getTypesAdmin: async () => {
        const response = await apiService.get<TypeResponse>("/movietype");
        return response.data;
    },
    createType: async (data: CreateTypeRequest) => {
        const response = await apiService.post<CreateTypeResponse>("/movietype", data);
        return response.data;
    },
    deleteType: async (id: string) => {
        const response = await apiService.delete<DeleteTypeResponse>(`/movietype/${id}`);
        return response.data;
    },
}
