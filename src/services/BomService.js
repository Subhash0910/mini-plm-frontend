import apiClient from "./apiClient";

const BomService = {
  createBom: (payload) => apiClient.post("/bom", payload),
  updateBom: (bomId, payload) => apiClient.put(`/bom/${bomId}`, payload),

  getBomById: (bomId) => apiClient.get(`/bom/${bomId}`),
  getActiveBomForPart: (partId) => apiClient.get(`/bom/part/${partId}/active`),
  getAllBomsForPart: (partId) => apiClient.get(`/bom/part/${partId}/all`),
  getFlattenedBom: (bomId) => apiClient.get(`/bom/${bomId}/flattened`),
};

export default BomService;
