import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/apiUtils';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T }>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    initialData?: T | null;
  } = {}
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: options.initialData || null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiFunction(...args);
        setState(prev => ({ ...prev, loading: false, data: response.data }));
        options.onSuccess?.(response.data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        options.onError?.(errorMessage);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: options.initialData || null,
      loading: false,
      error: null,
    });
  }, [options.initialData]);

  return {
    ...state,
    execute,
    reset,
  };
} 