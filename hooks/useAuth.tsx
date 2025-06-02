import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuth,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/lib/api/service/fetchAuth";
import { saveTokenToCookie } from "@/lib/api/cookies";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useMutation({
    mutationFn: (data: RegisterRequest) => fetchAuth.register(data),
    onSuccess: (response: RegisterResponse) => {
      if (response.statusCode) {
        router.push("/login");
      } else {
        setError(response.message || "Registration failed");
      }
    },
    onError: (error: Error) => {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed");
    },
  });

  return {
    register,
    isLoading,
    error: error || registerError?.message || null,
    clearError: () => setError(null),
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.login(credentials);
      if (!response?.statusCode) {
        throw new Error(response.message || "Đăng nhập thất bại.");
      }
      return response;
    },

    onSuccess: (response) => {
      const token = response.data?.token;
      if (!token) {
        setError("Không lấy được token từ phản hồi.");
        return;
      }
      console.log(token);

      saveTokenToCookie(token); // Lưu vào cookie
      queryClient.invalidateQueries({ queryKey: ["auth-token-2"] });
      setError(null);
    },

    onError: (err: any) => {
      console.error("Login error:", err);
      setError(err?.message || "Đăng nhập thất bại.");
    },
  });

  return {
    login,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
