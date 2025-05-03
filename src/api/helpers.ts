import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Helper to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError && error.response) {
    const { data } = error.response;
    
    // Show toast notification for errors
    if (data.message) {
      toast.error(data.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return {
      message: data.message || 'An unexpected error occurred',
      errors: data.errors,
    };
  }
  
  // Generic error handling
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  toast.error(errorMessage);
  
  return {
    message: errorMessage,
  };
};

// Format validation errors for forms
export const formatValidationErrors = (errors?: Record<string, string[]>): Record<string, string> => {
  if (!errors) return {};
  
  return Object.entries(errors).reduce((acc, [field, messages]) => {
    acc[field] = messages[0]; // Take the first error message for each field
    return acc;
  }, {} as Record<string, string>);
}; 