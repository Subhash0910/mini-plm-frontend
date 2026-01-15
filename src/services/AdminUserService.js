import apiClient from "./apiClient";

const AdminUserService = {
  listUsers: () => apiClient.get("/admin/users"),

  updateUserRole: (username, role) =>
    apiClient.put(`/admin/users/${encodeURIComponent(username)}/role`, { role }),
};

export default AdminUserService;
