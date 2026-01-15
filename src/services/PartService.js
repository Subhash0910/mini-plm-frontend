import apiClient from "./apiClient";

const DEFAULT_PAGE_SIZE = 200;

const PartService = {
  // -----------------------
  // READ
  // -----------------------
  getAllParts: (lifecycleState = "", page = 0, size = DEFAULT_PAGE_SIZE) => {
    // Backend returns a Spring Data Page<PartResponse>
    // GET /api/parts?lifecycleState=IN_WORK&page=0&size=200
    return apiClient.get("/parts", {
      params: {
        ...(lifecycleState ? { lifecycleState } : {}),
        page,
        size,
      },
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
