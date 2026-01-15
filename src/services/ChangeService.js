import apiClient from "./apiClient";

const ChangeService = {
  getAllChanges: () => apiClient.get("/changes"),
  getChangeById: (id) => apiClient.get(`/changes/${id}`),
  getChangesByStatus: (status) => apiClient.get(`/changes/status/${status}`),

  createChange: (payload) => apiClient.post("/changes", payload),
  
  /**
   * Submit a DRAFT change into the approval workflow.
   * Payload: { approverIds: ["user1", "user2"], comments: "please review" }
   */
  submitChange: (id, payload) => apiClient.post(`/changes/${id}/submit`, payload),

  approveChange: (id, payload) => apiClient.post(`/changes/${id}/approve`, payload),
  implementChange: (id) => apiClient.post(`/changes/${id}/implement`, {}),
};

export default ChangeService;
