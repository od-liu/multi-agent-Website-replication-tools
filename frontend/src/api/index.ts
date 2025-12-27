/**
 * API客户端配置
 * 使用Axios进行HTTP请求
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API基础URL配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * 创建Axios实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('Network Error:', error.message);
    } else {
      // 其他错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ========== 类型定义 ==========

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userId?: number;
  username?: string;
  message?: string;
}

export interface SendSMSRequest {
  userId: number;
  idCardLast4: string;
}

export interface SendSMSResponse {
  success: boolean;
  code?: string;
  message?: string;
}

export interface VerifySMSRequest {
  userId: number;
  idCardLast4: string;
  code: string;
}

export interface VerifySMSResponse {
  success: boolean;
  message?: string;
}

// ========== API方法 ==========

/**
 * 用户登录
 * @param data - 登录请求数据
 * @returns 登录响应
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};

/**
 * 发送短信验证码
 * @param data - 发送验证码请求数据
 * @returns 发送验证码响应
 */
export const sendSMS = async (data: SendSMSRequest): Promise<SendSMSResponse> => {
  const response = await apiClient.post<SendSMSResponse>('/api/auth/send-sms', data);
  return response.data;
};

/**
 * 验证短信验证码
 * @param data - 验证码验证请求数据
 * @returns 验证码验证响应
 */
export const verifySMS = async (data: VerifySMSRequest): Promise<VerifySMSResponse> => {
  const response = await apiClient.post<VerifySMSResponse>('/api/auth/verify-sms', data);
  return response.data;
};

export default apiClient;

