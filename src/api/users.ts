import apiClient from './container';
import { handleApiError, ApiResponse } from './helpers';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

// API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUser = async (id: number, userData: UpdateUserData): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}; 