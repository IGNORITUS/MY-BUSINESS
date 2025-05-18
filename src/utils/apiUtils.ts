import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const response = error.response;
    
    // Обработка ошибок валидации
    if (response?.status === 422 && response.data.errors) {
      return {
        message: 'Ошибка валидации',
        status: 422,
        errors: response.data.errors,
      };
    }

    // Обработка ошибок аутентификации
    if (response?.status === 401) {
      return {
        message: 'Необходима авторизация',
        status: 401,
      };
    }

    // Обработка ошибок доступа
    if (response?.status === 403) {
      return {
        message: 'Нет доступа',
        status: 403,
      };
    }

    // Обработка ошибок сервера
    if (response?.status === 500) {
      return {
        message: 'Внутренняя ошибка сервера',
        status: 500,
      };
    }

    // Обработка других ошибок с сообщением от сервера
    if (response?.data?.message) {
      return {
        message: response.data.message,
        status: response.status,
      };
    }
  }

  // Обработка неизвестных ошибок
  return {
    message: 'Произошла неизвестная ошибка',
  };
};

export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  
  if (apiError.errors) {
    return formatValidationErrors(apiError.errors);
  }
  
  return apiError.message;
}; 