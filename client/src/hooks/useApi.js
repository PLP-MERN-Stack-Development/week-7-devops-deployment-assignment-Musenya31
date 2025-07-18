import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = undefined, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      // If data is FormData, don't set Content-Type (let browser handle it)
      const isFormData = data instanceof FormData;
      const requestConfig = {
        method,
        url,
        ...(data !== undefined ? { data } : {}),
        ...(isFormData ? { headers: {} } : {}),
        ...config,
      };
      const response = await api.request(requestConfig);
      if (response.data === undefined || response.data === null) {
        return {};
      }
      return response.data;
    } catch (err) {
      let errorMessage = 'An error occurred';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          try {
            const parsed = JSON.parse(err.response.data);
            errorMessage = parsed.message || err.response.data;
          } catch {
            errorMessage = err.response.data;
          }
        } else {
          errorMessage = err.response.data.message || err.message;
        }
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config) => request('GET', url, undefined, config), [request]);
  const post = useCallback((url, data, config) => request('POST', url, data, config), [request]);
  const put = useCallback((url, data, config) => request('PUT', url, data, config), [request]);
  const del = useCallback((url, config) => request('DELETE', url, undefined, config), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
}; 