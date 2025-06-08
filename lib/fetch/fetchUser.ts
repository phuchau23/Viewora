export interface LoginResponse {
    token: string;
    user: { id: string; email: string };
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }