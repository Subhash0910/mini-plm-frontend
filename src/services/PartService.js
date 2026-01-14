import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

const PartService = {
  // -----------------------
  // READ
  // -----------------------
  getAllParts: (lifecycleState = "") => {
    // GET /api/parts?lifecycleState=IN_WORK
    return api.get("/parts", {
      params: lifecycleState ? { lifecycleState } : {},
    });
  },

  getPartById: (id) => {
    // OPTIONAL (recommended): GET /api/parts/{id}
    // If you don't have backend endpoint yet, either add it or remove this method.
    return api.get(`/parts/${id}`);
  },

  getPartHistory: (id) => {
    // GET /api/parts/{id}/history
    return api.get(`/parts/${id}/history`);
  },

  // -----------------------
  // CREATE / UPDATE
  // -----------------------
  createPart: (part) => {
    // POST /api/parts
    return api.post("/parts", part);
  },

  updatePart: (id, part) => {
    // PUT /api/parts/{id}
    return api.put(`/parts/${id}`, part);
  },

  // -----------------------
  // LIFECYCLE ACTIONS
  // -----------------------
  promotePart: (id, transitionedBy = "system") => {
    // POST /api/parts/{id}/promote?transitionedBy=sam
    return api.post(`/parts/${id}/promote`, null, {
      params: { transitionedBy },
    });
  },

  revisePart: (id, transitionedBy = "system") => {
    // POST /api/parts/{id}/revise?transitionedBy=sam
    return api.post(`/parts/${id}/revise`, null, {
      params: { transitionedBy },
    });
  },

  obsoletePart: (id, transitionedBy = "system") => {
    // POST /api/parts/{id}/obsolete?transitionedBy=sam
    return api.post(`/parts/${id}/obsolete`, null, {
      params: { transitionedBy },
    });
  },

  // -----------------------
  // DELETE
  // -----------------------
  deletePart: (id) => {
    // DELETE /api/parts/{id}
    return api.delete(`/parts/${id}`);
  },
};

export default PartService;
