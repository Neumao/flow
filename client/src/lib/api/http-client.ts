import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "auth_token";

// Industry standard API response types
export interface ApiResponse<T = Record<string, unknown>> {
  data: T;
  message?: string;
  success: boolean;
  status?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  public async get<T = Record<string, unknown>>(
    url: string,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get(url);
    return response.data;
  }

  public async post<T = Record<string, unknown>>(
    url: string,
    data?: Record<string, unknown> | FormData,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  public async put<T = Record<string, unknown>>(
    url: string,
    data?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  public async delete<T = Record<string, unknown>>(
    url: string,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

export const httpClient = new HttpClient();
export default httpClient;
