import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, isLoading: false });
      return response;
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        isLoading: false,
      });
      throw error;
    }
  }, [asyncFunction]);

  return { ...state, execute };
}
