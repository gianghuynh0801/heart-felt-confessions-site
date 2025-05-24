
// PostgREST API configuration
const API_BASE_URL = process.env.VITE_POSTGREST_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { data: null, error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('API request error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return api.request<T>(endpoint, { method: 'GET' });
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return api.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return api.request<T>(endpoint, { method: 'DELETE' });
  }
};
