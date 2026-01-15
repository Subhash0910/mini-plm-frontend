import React, { useState } from "react";
import "./changeApproveModal.css";

function ChangeApproveModal({ onSubmit, onClose }) {
  const [status, setStatus] = useState("APPROVED");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await onSubmit({
        status,
        comments,
      });
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data || err?.message || "Failed to approve change"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wc-modal-backdrop">
      <div className="wc-modal wc-approve-modal">
        <div className="wc-modal-header">
          <h3>Approve or Reject</h3>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="wc-modal-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Decision *</label>
            <div className="wc-approve-options">
              <label className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="APPROVED"
                  checked={status === "APPROVED"}
                  onChange={() => setStatus("APPROVED")}
                />
                <span className="form-check-label">✓ Approve</span>
              </label>
              <label className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  value="REJECTED"
                  checked={status === "REJECTED"}
                  onChange={() => setStatus("REJECTED")}
                />
                <span className="form-check-label text-danger">✕ Reject</span>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your approval comments..."
              rows="3"
            />
          </div>

          <div className="wc-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={status === "APPROVED" ? "btn btn-success" : "btn btn-danger"}
              disabled={loading}
            >
              {loading ? "Processing..." : status === "APPROVED" ? "Approve" : "Reject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeApproveModal;
