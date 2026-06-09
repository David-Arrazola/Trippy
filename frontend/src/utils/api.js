const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const TOKEN_KEY = "trippy_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const authApi = {
  register: (body) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiFetch("/api/auth/me"),
};

export const itineraryApi = {
  list: () => apiFetch("/api/itineraries"),
  get: (id) => apiFetch(`/api/itineraries/${id}`),
  create: (body) =>
    apiFetch("/api/itineraries", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    apiFetch(`/api/itineraries/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) =>
    apiFetch(`/api/itineraries/${id}`, { method: "DELETE" }),
  getShared: (shareId) => apiFetch(`/api/itineraries/share/${shareId}`),
};

export const tripApi = {
  plan: (body) =>
    apiFetch("/api/trip", { method: "POST", body: JSON.stringify(body) }),
};
