import React, { useState } from "react";
import "./changeSubmitModal.css";

function ChangeSubmitModal({ changeId, onSubmit, onClose }) {
  const [approvers, setApprovers] = useState([""]);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addApprover = () => {
    setApprovers([...approvers, ""]);
  };

  const removeApprover = (index) => {
    setApprovers(approvers.filter((_, i) => i !== index));
  };

  const updateApprover = (index, value) => {
    const newApprovers = [...approvers];
    newApprovers[index] = value;
    setApprovers(newApprovers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const approverIds = approvers.filter((a) => a.trim());
    if (approverIds.length === 0) {
      setError("At least one approver is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        approverIds,
        comments,
      });
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data || err?.message || "Failed to submit change"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wc-modal-backdrop">
      <div className="wc-modal wc-submit-modal">
        <div className="wc-modal-header">
          <h3>Submit Change for Review</h3>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="wc-modal-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Approvers *</label>
            <div className="wc-approvers-list">
              {approvers.map((approver, index) => (
                <div key={index} className="wc-approver-row">
                  <input
                    type="text"
                    className="form-control"
                    value={approver}
                    onChange={(e) => updateApprover(index, e.target.value)}
                    placeholder={`Approver ${index + 1} (username)`}
                  />
                  {approvers.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeApprover(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={addApprover}>
              + Add Approver
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Routing Comments</label>
            <textarea
              className="form-control"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Why is this change being routed for approval?"
              rows="3"
            />
          </div>

          <div className="wc-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeSubmitModal;
