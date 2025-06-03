"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuth,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/lib/api/service/fetchAuth";
import { saveTokenToCookie } from "@/lib/api/cookies";
import { useToast } from "@/hooks/use-toast"; // Đổi từ sonner sang useToast

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast(); // Sử dụng useToast
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useMutation({
    mutationFn: (data: RegisterRequest) => fetchAuth.register(data),
    onSuccess: (response: RegisterResponse) => {
      console.log("Register response:", response);
      if (response.statusCode === "200") {
        toast({
          title: "Thành công",
          description:
            "Bạn đã đăng ký thành công, hãy kiểm tra email để xác minh tài khoản",
        });
        setError(null);
      } else {
        const errorMessage = response.message || "Đăng ký thất bại";
        setError(errorMessage);
        toast({
          title: "Thất bại",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Đăng ký thất bại";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast(); // Sử dụng useToast
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.login(credentials);
      console.log("Login response:", response);

      if (response.code !== 200) { // code là number
        throw new Error(response.message || "Đăng nhập thất bại.");
      }

      return response;
    },

    onSuccess: (response) => {
      const token = response.data?.token;
      if (!token) {
        setError("Không lấy được token từ phản hồi.");
        toast({
          title: "Thất bại",
          description: "Không lấy được token từ phản hồi.",
          variant: "destructive",
        });
        return;
      }

      saveTokenToCookie(token);
      toast({ title: "Thành công", description: "Bạn đã đăng nhập" });

      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["auth-token-2"] });
      setError(null);
    },

    onError: (err: any) => {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Đăng nhập thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    login,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

export function useVerifyEmail() {
  const router = useRouter();
  const { toast } = useToast(); // Sử dụng useToast
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyEmail, isPending: isLoading } = useMutation({
    mutationFn: async (
      credentials: VerifyEmailRequest
    ): Promise<VerifyEmailResponse> => {
      const response = await fetchAuth.verifyEmail(credentials);
      console.log("Verify email response:", response);

      if (!response?.code || response.code !== 200) { // code là number
        throw new Error(response.message || "Xác minh thất bại.");
      }

      return response;
    },

    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã xác minh OTP" });
      router.push("/login");
      setError(null);
    },

    onError: (err: any) => {
      console.error("Verify OTP error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Xác minh thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    verifyEmail,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
