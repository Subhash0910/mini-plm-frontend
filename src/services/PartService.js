import apiClient from "./apiClient";

const PartService = {
  // -----------------------
  // READ
  // -----------------------
  getAllParts: (lifecycleState = "") => {
    // GET /api/parts?lifecycleState=IN_WORK
    return apiClient.get("/parts", {
      params: lifecycleState ? { lifecycleState } : {},
    });
  },

  getPartById: (id) => {
    return apiClient.get(`/parts/${id}`);
  },

  getPartHistory: (id) => {
    return apiClient.get(`/parts/${id}/history`);
  },

  // -----------------------
  // CREATE / UPDATE
  // -----------------------
  createPart: (part) => {
    return apiClient.post("/parts", part);
  },

  updatePart: (id, part) => {
    return apiClient.put(`/parts/${id}`, part);
  },

  // -----------------------
  // LIFECYCLE ACTIONS
  // -----------------------
  promotePart: (id, transitionedBy = "system") => {
    return apiClient.post(`/parts/${id}/promote`, null, {
      params: { transitionedBy },
    });
  },

  revisePart: (id, transitionedBy = "system") => {
    return apiClient.post(`/parts/${id}/revise`, null, {
      params: { transitionedBy },
    });
  },

  obsoletePart: (id, transitionedBy = "system") => {
    return apiClient.post(`/parts/${id}/obsolete`, null, {
      params: { transitionedBy },
    });
  },

  // -----------------------
  // DELETE
  // -----------------------
  deletePart: (id) => {
    return apiClient.delete(`/parts/${id}`);
  },
};

export default PartService;
