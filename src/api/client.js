const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const buildUrl = (endpoint, params) => {
  if (!params) return `${API_URL}${endpoint}`;

  // Remove undefined/null values so we don't send things like `search=undefined`
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  const qs = new URLSearchParams(cleaned).toString();
  return `${API_URL}${endpoint}${qs ? `?${qs}` : ''}`;
};

export const apiRequest = async (endpoint, { method = 'GET', data, params, headers = {} } = {}) => {
  const token = localStorage.getItem('micu_token');
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(buildUrl(endpoint, params), config);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }
  return result;
};

