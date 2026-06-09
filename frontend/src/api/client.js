const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "请求失败");
  }
  return data;
}

export const api = {
  health: () => request("/health"),
  listGrades: () => request("/grades"),
  createGrade: (payload) =>
    request("/grades", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateGrade: (id, payload) =>
    request(`/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getTranscript: (studentNo) => request(`/students/${studentNo}/transcript`),
  listAppeals: () => request("/appeals"),
  createAppeal: (payload) =>
    request("/appeals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAppeal: (id, payload) =>
    request(`/appeals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
