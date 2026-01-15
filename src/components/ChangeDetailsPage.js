import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangeService from "../services/ChangeService";
import { auth } from "../services/auth";
import JsonEditorPanel from "./JsonEditorPanel";
import "./changeDetailsPage.css";

function ChangeDetailsPage({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = auth.getUser();
  const role = user?.role;
  const canAct = role === "ENGINEER" || role === "ADMIN";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [change, setChange] = useState(null);

  const [showApprove, setShowApprove] = useState(false);

  const approveTemplate = useMemo(() => {
    return {
      approvalStatus: "APPROVED",
      comments: "Looks good.",
    };
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ChangeService.getChangeById(id);
      setChange(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || e?.response?.data || e?.message || "Failed to load change");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const approve = async (payload) => {
    if (!canAct) {
      showToast?.("Only ENGINEER/ADMIN can approve changes", "info");
      return;
    }
    await ChangeService.approveChange(id, payload);
    showToast?.("Change updated", "success");
    await load();
  };

  const implement = async () => {
    if (!canAct) {
      showToast?.("Only ENGINEER/ADMIN can implement changes", "info");
      return;
    }
    try {
      await ChangeService.implementChange(id);
      showToast?.("Change implemented", "success");
      await load();
    } catch (e) {
      showToast?.(e?.response?.data?.message || e?.response?.data || e?.message || "Implement failed", "error");
    }
  };

  return (
    <div className="wc-change-details-page">
      <div className="wc-change-details-header">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate("/changes")}
          type="button"
        >
          ← Back
        </button>

        <div className="wc-change-details-actions">
          {canAct && (
            <>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setShowApprove(true)}>
                Approve/Reject
              </button>
              <button className="btn btn-sm btn-primary" onClick={implement}>
                Implement
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <div className="wc-change-info">Loading…</div>}
      {error && <div className="wc-change-error">{String(error)}</div>}

      {!loading && !error && change && (
        <>
          <h2 className="wc-change-title">Change #{change?.changeNumber || change?.id || id}</h2>
          <div className="wc-change-json">
            <pre>{JSON.stringify(change, null, 2)}</pre>
          </div>
        </>
      )}

      {showApprove && (
        <JsonEditorPanel
          title="Approve / Reject Change (JSON)"
          initialJson={approveTemplate}
          submitLabel="Submit"
          onSubmit={approve}
          onClose={() => setShowApprove(false)}
        />
      )}
    </div>
  );
}

export default ChangeDetailsPage;
