import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangeService from "../services/ChangeService";
import { auth } from "../services/auth";
import ChangeCreateModal from "./ChangeCreateModal";
import "./changesPage.css";

const STATUS_COLORS = {
  DRAFT: "#6c757d",
  PENDING_APPROVAL: "#ffc107",
  APPROVED: "#28a745",
  REJECTED: "#dc3545",
  IMPLEMENTED: "#007bff",
};

function getField(obj, keys, fallback = "") {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
}

function ChangesPage({ showToast }) {
  const navigate = useNavigate();
  const user = auth.getUser();
  const role = user?.role;

  const canCreate = role === "ENGINEER" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [changes, setChanges] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = statusFilter
        ? await ChangeService.getChangesByStatus(statusFilter)
        : await ChangeService.getAllChanges();
      setChanges(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setChanges([]);
      setError(e?.response?.data?.message || e?.response?.data || e?.message || "Failed to load changes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const createChange = async (payload) => {
    if (!canCreate) {
      showToast?.("Only ENGINEER/ADMIN can create changes", "info");
      return;
    }

    try {
      await ChangeService.createChange(payload);
      showToast?.("Change created successfully", "success");
      setShowCreate(false);
      await load();
    } catch (err) {
      showToast?.(err?.response?.data?.message || "Failed to create change", "error");
    }
  };

  const handleRowClick = (changeId) => {
    navigate(`/changes/${changeId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="wc-changes-page">
      <div className="wc-changes-header">
        <div>
          <h2 className="wc-changes-title">Changes</h2>
          <p className="wc-changes-sub">Engineering change requests with approval workflows.</p>
        </div>

        <div className="wc-changes-actions">
          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: 190 }}
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="IMPLEMENTED">Implemented</option>
          </select>

          <button className="btn btn-sm btn-outline-secondary" onClick={load} disabled={loading}>
            Refresh
          </button>

          {canCreate && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowCreate(true)}>
              + Create Change
            </button>
          )}
        </div>
      </div>

      {loading && <div className="wc-changes-info">Loading…</div>}
      {error && <div className="wc-changes-error">{String(error)}</div>}

      <div className="wc-changes-table-wrap">
        <table className="wc-changes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Number</th>
              <th>Title</th>
              <th>Status</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {changes.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="wc-changes-empty">
                  No changes found.
                </td>
              </tr>
            ) : (
              changes.map((c) => {
                const id = getField(c, ["id", "changeId"], "");
                const number = getField(c, ["changeNumber", "number"], "—");
                const title = getField(c, ["title", "name"], "—");
                const status = getField(c, ["status"], "—");
                const type = getField(c, ["changeType", "type"], "—");
                const priority = getField(c, ["priority"], "—");
                const created = formatDate(getField(c, ["createdAt", "createdDate"]));

                return (
                  <tr key={id || number} className="wc-changes-row" onClick={() => handleRowClick(id)}>
                    <td className="wc-changes-id">{id || "—"}</td>
                    <td className="wc-changes-number">{String(number)}</td>
                    <td className="wc-changes-title">{String(title)}</td>
                    <td>
                      <span
                        className="wc-status-badge"
                        style={{ backgroundColor: STATUS_COLORS[status] || "#6c757d" }}
                      >
                        {String(status)}
                      </span>
                    </td>
                    <td>{String(type)}</td>
                    <td>{String(priority)}</td>
                    <td>{created}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <ChangeCreateModal onSubmit={createChange} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

export default ChangesPage;
