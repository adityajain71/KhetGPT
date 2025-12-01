import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  // Convert to form data as required by OAuth2
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axios.post<TokenResponse>(
    `${API_BASE_URL}/api/auth/token`,
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );
  
  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response.data;
};

export const register = async (userData: UserRegistration): Promise<{ detail: string }> => {
  const response = await axios.post<{ detail: string }>(
    `${API_BASE_URL}/api/auth/register`,
    userData
  );
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};