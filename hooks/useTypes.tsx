"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeService } from "@/lib/api/service/fetchTypes";
import { useState } from "react";
import { useToast } from "./use-toast";

export function useGetTypes() {
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["types"],
        queryFn: TypeService.getTypesAdmin,
    });

    return {
        types: data,
        isLoading,
        isError,
        error,
    };
}

export function useCreateType() {
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { mutate: createType, isPending: isLoading } = useMutation({
        mutationFn: TypeService.createType,
        onSuccess: () => {
            toast({ title: "Thành công", description: "Bạn đã tạo loại phim" });
            setError(null);
            queryClient.invalidateQueries({ queryKey: ["types"] });
        },
        onError: (err: any) => {
            const errorMessage =
                err.response?.data?.message || err.message || "Tạo loại phim thất bại.";
            setError(errorMessage);
            toast({
                title: "Thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });

    return {
        createType,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}

export function useDeleteType() {
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { mutate: deleteType, isPending: isLoading } = useMutation({
        mutationFn: TypeService.deleteType,
        onSuccess: () => {
            toast({ title: "Thành công", description: "Bạn đã xóa loại phim" });
            setError(null);
            queryClient.invalidateQueries({ queryKey: ["types"] });
        },
        onError: (err: any) => {
            const errorMessage =
                err.response?.data?.message || err.message || "Xóa loại phim thất bại.";
            setError(errorMessage);
            toast({
                title: "Thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });

    return {
        deleteType,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}