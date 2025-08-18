// API Configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://89.116.186.230:5000",
  endpoint: import.meta.env.VITE_API_ENDPOINT || "/api",
  get fullUrl() {
    return `${this.baseUrl}${this.endpoint}`;
  },
};

// API Helper functions
export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.fullUrl}${path}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
};

export default API_CONFIG;
