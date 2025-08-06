// src/hooks/useAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuth,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LoginWithGoogleResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerifyEmailRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyResetPasswordRequest,
  VerifyResetPasswordResponse,
} from "@/lib/api/service/fetchAuth";
import { saveTokenToCookie } from "@/utils/cookies";
import { useToast } from "@/hooks/use-toast";
import {
  handleGoogleRedirectResult,
  signInWithGoogle,
} from "@/lib/firebase/auth";
import { logEvent } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import { cleanExpiredTokenOnLoad } from "@/utils/cookies";
import Cookies from "js-cookie";
import { getToken } from "@/utils/cookies";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    cleanExpiredTokenOnLoad();
    setToken(getToken());
  }, []);

  const logout = () => {
    Cookies.remove("auth-token");
    setToken(null);
    router.push("/login");
  };

  return { token, isLoggedIn: !!token, logout };
}

// Hook: useRegister
export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useMutation({
    mutationFn: fetchAuth.register,
    onSuccess: (response: RegisterResponse) => {
      if (response.code === 200) {
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
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng ký thất bại";
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

// Hook: useVerifyEmail
export function useVerifyEmail() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyEmail, isPending: isLoading } = useMutation({
    mutationFn: async (
      data: VerifyEmailRequest
    ): Promise<VerifyEmailResponse> => {
      const response = await fetchAuth.verifyEmail(data);

      if (!response?.code || response.code !== 200) {
        throw new Error(response.message || "Xác minh thất bại.");
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã xác minh OTP" });
      router.replace(" /login");
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || "Xác minh thất bại.";
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

// Hook: useResendVerifyEmail
export function useResendVerifyEmail() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: resendVerifyEmail, isPending: isLoading } = useMutation({
    mutationFn: async (
      data: ResendVerifyEmailRequest
    ): Promise<VerifyEmailResponse> => {
      const response = await fetchAuth.resendVerifyEmail(data);

      if (!response?.code || response.code !== 200) {
        throw new Error(response.message || "Xác minh thất bại.");
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã xác minh OTP" });
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || "Xác minh thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    resendVerifyEmail,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Hook: useLogin
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.login(data);
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
      queryClient.invalidateQueries({ queryKey: ["auth-token-2"] });
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage = "Đăng nhập thất bại.";
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

// Hook: useForgotPassword
export function useForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: forgotPassword, isPending: isLoading } = useMutation({
    mutationFn: async (
      data: ForgotPasswordRequest
    ): Promise<ForgotPasswordResponse> => {
      const response = await fetchAuth.forgotPassword(data);

      if (!response?.code || response.code !== 200) {
        throw new Error(response.message || "Quên mật khẩu thất bại.");
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã xác minh OTP" });
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || "Quên mật khẩu thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    forgotPassword,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

//Hook: useVerifyResetPassword
export function useVerifyResetPassword() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyResetPassword, isPending: isLoading } = useMutation({
    mutationFn: async (
      data: VerifyResetPasswordRequest
    ): Promise<VerifyResetPasswordResponse> => {
      const response = await fetchAuth.verifyResetPassword(data);

      if (!response?.code || response.code !== 200) {
        throw new Error(response.message || "Xác minh thất bại.");
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã xác minh OTP" });
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || "Xác minh thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    verifyResetPassword,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Hook: useResetPassword
export function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: resetPassword, isPending: isLoading } = useMutation({
    mutationFn: async (
      data: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> => {
      const response = await fetchAuth.resetPassword(data);

      if (!response?.code || response.code !== 200) {
        throw new Error(response.message || "Đặt lại mật khẩu thất bại.");
      }

      return response;
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Bạn đã đặt lại mật khẩu" });
      router.replace("/login");
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đặt lại mật khẩu thất bại.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    resetPassword,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Hook: useGoogleLogin
export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false); // Theo dõi trạng thái redirect

  // Xử lý redirect khi ứng dụng khởi động
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setIsRedirecting(true);
        const result = await handleGoogleRedirectResult();
        if (result && result.idToken) {
          const response = await fetchAuth.loginWithGoogle(result.idToken);
          if (response.code !== 200) {
            throw new Error(response.message || "Đăng nhập Google thất bại.");
          }
          handleSuccess(response);
        }
      } catch (err: any) {
        handleError(err, true);
      } finally {
        setIsRedirecting(false);
      }
    };
    checkRedirectResult();
  }, []);

  const { mutate: googleLogin, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const googleResult = await signInWithGoogle();

      if (!googleResult) {
        throw new Error("Đăng nhập Google bị hủy hoặc đóng cửa sổ.");
      }

      const { idToken } = googleResult;
      if (!idToken) {
        throw new Error("Không lấy được Google ID token.");
      }

      const response = await fetchAuth.loginWithGoogle(idToken);
      if (response.code !== 200) {
        throw new Error(response.message || "Đăng nhập Google thất bại.");
      }

      return response;
    },
    onSuccess: (response) => {
      if (!response) return; // Bỏ qua nếu đang chờ redirect
      handleSuccess(response);
    },
    onError: (err: any) => {
      handleError(err, false);
    },
  });

  const handleSuccess = (response: LoginWithGoogleResponse) => {
    const token = response.data?.token;
    if (!token) {
      const errorMessage = "Không lấy được token từ phản hồi.";
      setError(errorMessage);
      toast({
        title: "Thất bại",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    saveTokenToCookie(token);
    toast({ title: "Thành công", description: "Bạn đã đăng nhập bằng Google" });
    logEvent(getAnalytics(), "login", { method: "google" });
    router.push("/");
    queryClient.invalidateQueries({ queryKey: ["auth-token-2"] });
    setError(null);
  };

  const handleError = (err: any, isRedirect: boolean) => {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Đăng nhập Google thất bại.";
    setError(errorMessage);
    toast({
      title: "Thất bại",
      description: errorMessage,
      variant: "destructive",
    });
    if (isRedirect) {
      router.replace("/login");
    }
  };

  return {
    googleLogin,
    isLoading,
    error,
    isRedirecting,
    clearError: () => setError(null),
  };
}
