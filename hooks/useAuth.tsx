// src/hooks/useAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuth,
  LoginRequest,
  LoginResponse,
  LoginWithGoogleResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/lib/api/service/fetchAuth";
import { saveTokenToCookie } from "@/lib/ultils/cookies";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { logEvent } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";


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
    mutationFn: (data: RegisterRequest) => fetchAuth.register(data),
    onSuccess: (response: RegisterResponse) => {
      console.log("Register response:", response);
      if (response.code === 200) {
        toast({
          title: "Thành công",
          description: "Bạn đã đăng ký thành công, hãy kiểm tra email để xác minh tài khoản",
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

// Hook: useLogin
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await fetchAuth.login(credentials);
      console.log("Login response:", response);

      if (response.code !== 200) {
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
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng nhập thất bại.";
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

// Hook: useVerifyEmail
export function useVerifyEmail() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyEmail, isPending: isLoading } = useMutation({
    mutationFn: async (credentials: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
      const response = await fetchAuth.verifyEmail(credentials);
      console.log("Verify email response:", response);

      if (!response?.code || response.code !== 200) {
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

// Hook: useGoogleLogin
export function useGoogleLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
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
            throw new Error(response.message || 'Đăng nhập Google thất bại.');
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
      console.log('Starting Google login...');
      const googleResult = await signInWithGoogle();
      
      if (!googleResult) {
        console.log('Redirect initiated, awaiting result...');
        setIsRedirecting(true);
        return null;
      }

      const { idToken } = googleResult;
      console.log('Google ID token:', idToken); // Log trước khi gửi
      if (!idToken) {
        throw new Error('Không lấy được Google ID token.');
      }

      const response = await fetchAuth.loginWithGoogle(idToken);
      if (response.code !== 200) {
        throw new Error(response.message || 'Đăng nhập Google thất bại.');
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
      const errorMessage = 'Không lấy được token từ phản hồi.';
      setError(errorMessage);
      toast({
        title: 'Thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    saveTokenToCookie(token);
    toast({ title: 'Thành công', description: 'Bạn đã đăng nhập bằng Google' });
    logEvent(getAnalytics(), 'login', { method: 'google' });
    router.push('/');
    queryClient.invalidateQueries({ queryKey: ['auth-token-2'] });
    setError(null);
  };

  const handleError = (err: any, isRedirect: boolean) => {
    console.error('Google login error:', err);
    const errorMessage =
      err.response?.data?.message || err.message || 'Đăng nhập Google thất bại.';
    setError(errorMessage);
    toast({
      title: 'Thất bại',
      description: errorMessage,
      variant: 'destructive',
    });
    if (isRedirect) {
      router.push('/login');
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