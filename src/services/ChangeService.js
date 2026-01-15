import apiClient from "./apiClient";

const ChangeService = {
  getAllChanges: () => apiClient.get("/changes"),
  getChangeById: (id) => apiClient.get(`/changes/${id}`),
  getChangesByStatus: (status) => apiClient.get(`/changes/status/${status}`),

  createChange: (payload) => apiClient.post("/changes", payload),
  approveChange: (id, payload) => apiClient.post(`/changes/${id}/approve`, payload),
  implementChange: (id) => apiClient.post(`/changes/${id}/implement`, {}),
};

export default ChangeService;
