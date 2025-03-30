const API_BASE_URL = 'http://localhost:8080'

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Có lỗi xảy ra");
  return data;
};