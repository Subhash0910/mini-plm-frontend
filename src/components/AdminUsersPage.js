import React, { useEffect, useMemo, useState } from "react";
import AdminUserService from "../services/AdminUserService";
import { auth } from "../services/auth";
import "./adminUsers.css";

const ROLES = ["ADMIN", "ENGINEER", "VIEWER"];

function AdminUsersPage({ showToast }) {
  const currentUser = auth.getUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingUsername, setSavingUsername] = useState(null);

  const canManageUsers = useMemo(() => currentUser?.role === "ADMIN", [currentUser]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AdminUserService.listUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.response?.data || e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRoleLocal = (username, role) => {
    setUsers((prev) => prev.map((u) => (u.username === username ? { ...u, role } : u)));
  };

  const saveRole = async (username, role) => {
    if (!canManageUsers) return;
    setSavingUsername(username);
    try {
      await AdminUserService.updateUserRole(username, role);
      showToast?.(`Updated ${username} → ${role}`, "success");
      await load();
    } catch (e) {
      showToast?.(
        e?.response?.data?.message || e?.response?.data || e?.message || "Failed to update role",
        "error"
      );
    } finally {
      setSavingUsername(null);
    }
  };

  return (
    <div className="wc-admin-page">
      <div className="wc-admin-header">
        <h2 className="wc-admin-title">User Administration</h2>
        <button className="btn btn-sm btn-outline-secondary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      <p className="wc-admin-subtitle">
        Manage user roles (Windchill-like): VIEWER = read-only, ENGINEER = authoring, ADMIN = site admin.
      </p>

      {loading && <div className="wc-admin-info">Loading…</div>}
      {error && <div className="wc-admin-error">{error}</div>}

      <div className="wc-admin-table-wrap">
        <table className="wc-admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: 140 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="wc-admin-empty">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id || u.username}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="wc-admin-select"
                      value={u.role || "VIEWER"}
                      onChange={(e) => setRoleLocal(u.username, e.target.value)}
                      disabled={!canManageUsers}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={!canManageUsers || savingUsername === u.username}
                      onClick={() => saveRole(u.username, u.role || "VIEWER")}
                      type="button"
                    >
                      {savingUsername === u.username ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!canManageUsers && (
        <div className="wc-admin-hint">
          This page requires ADMIN role.
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
