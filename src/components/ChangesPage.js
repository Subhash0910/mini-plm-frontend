import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ChangeService from "../services/ChangeService";
import { auth } from "../services/auth";
import JsonEditorPanel from "./JsonEditorPanel";
import "./changesPage.css";

const STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "IMPLEMENTED",
];

function getField(obj, keys, fallback = "") {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
}

function ChangesPage({ showToast }) {
  const user = auth.getUser();
  const role = user?.role;

  const canCreate = role === "ENGINEER" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [changes, setChanges] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const createTemplate = useMemo(() => {
    return {
      changeNumber: "CHG-0001",
      title: "Change title",
      description: "Why this change is needed",
      changeType: "ECR",
      priority: "MEDIUM",
      affectedPartIds: [],
    };
  }, []);

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

    await ChangeService.createChange(payload);
    showToast?.("Change created", "success");
    await load();
  };

  return (
    <div className="wc-changes-page">
      <div className="wc-changes-header">
        <div>
          <h2 className="wc-changes-title">Changes</h2>
          <div className="wc-changes-sub">Windchill-like change objects with lifecycle actions.</div>
        </div>

        <div className="wc-changes-actions">
          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: 190 }}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
            </tr>
          </thead>
          <tbody>
            {changes.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="wc-changes-empty">
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

                return (
                  <tr key={id || number}>
                    <td>
                      {id ? (
                        <Link className="wc-changes-link" to={`/changes/${id}`}>
                          {id}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{String(number)}</td>
                    <td>{String(title)}</td>
                    <td>{String(status)}</td>
                    <td>{String(type)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <JsonEditorPanel
          title="Create Change (JSON)"
          initialJson={createTemplate}
          submitLabel="Create"
          onSubmit={createChange}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

export default ChangesPage;
