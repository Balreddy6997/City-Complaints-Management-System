const API = "https://city-complaints-backend.onrender.com/api";

export const apiFetch = async (path, method = "GET", body = null, token = null) => {
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json();
    console.log(`[API] ${method} ${path} - Status: ${res.status}`, data);
    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${path}:`, error);
    throw error;
  }
};

export const apiUpload = async (path, formData, token) => {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return res.json();
};