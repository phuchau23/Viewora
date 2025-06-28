import apiService from "../core";

export interface SnackSelectionResponse {
    code: number;
    statusCode : string;
    message : string;
    data : SnackSelection[];
}   

export interface SnackSelection {
    id: string;
    showTimeId: string;
    snack : Snack[]
}
export interface Snack {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    unitPrice : number;
}

export const SnackSelectionService = {
    createSnackSelection : async (formData : FormData) => {
        const response = await apiService.post<SnackSelectionResponse>(`/snackselection`, formData);
        return response.data;
    },
}