import apiClient from './container';
import { handleApiError, ApiResponse } from './helpers';

// Types
export interface User {
  _id: string;
  email: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  authMethod: string;
  userName: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  phone_number: string;
}

export interface UsersResponse {
  users: User[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  userName?: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  role?: string;
}

// API functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<UsersResponse>('/mudra/users');
    return response.data.users;
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

export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(`/mudra/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}; 