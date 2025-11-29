import api from './api';
import { AxiosRequestConfig } from 'axios';

interface HttpOptions extends AxiosRequestConfig {
  formData?: boolean;
}

/**
 * Convert an object to FormData, automatically handling File objects
 */
function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }

    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    } else if (typeof value === 'number') {
      formData.append(key, value.toString());
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

/**
 * HTTP service wrapper with FormData support
 */
const http = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.get<T>(url, config);
  },

  /**
   * POST request with optional FormData support
   * @param url - API endpoint
   * @param data - Request payload
   * @param options - Request options, use { formData: true } for multipart/form-data
   */
  post: <T = any>(url: string, data?: any, options?: HttpOptions) => {
    if (options?.formData && data) {
      const formData = toFormData(data);
      const { formData: _, ...restOptions } = options;

      return api.post<T>(url, formData, {
        ...restOptions,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...restOptions.headers,
        },
      });
    }

    return api.post<T>(url, data, options);
  },

  /**
   * PUT request with optional FormData support
   */
  put: <T = any>(url: string, data?: any, options?: HttpOptions) => {
    if (options?.formData && data) {
      const formData = toFormData(data);
      const { formData: _, ...restOptions } = options;

      return api.put<T>(url, formData, {
        ...restOptions,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...restOptions.headers,
        },
      });
    }

    return api.put<T>(url, data, options);
  },

  /**
   * PATCH request with optional FormData support
   */
  patch: <T = any>(url: string, data?: any, options?: HttpOptions) => {
    if (options?.formData && data) {
      const formData = toFormData(data);
      const { formData: _, ...restOptions } = options;

      return api.patch<T>(url, formData, {
        ...restOptions,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...restOptions.headers,
        },
      });
    }

    return api.patch<T>(url, data, options);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<T>(url, config);
  },
};

export default http;
