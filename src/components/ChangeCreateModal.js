import React, { useState } from "react";
import "./changeCreateModal.css";

function ChangeCreateModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    changeType: "ECR",
    priority: "MEDIUM",
    impactAssessment: "",
    assignedTo: "",
    dueDate: "",
    effectiveDate: "",
    affectedPartIds: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        affectedPartIds: formData.affectedPartIds
          ? formData.affectedPartIds.split(",").map((id) => parseInt(id.trim()))
          : [],
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        effectiveDate: formData.effectiveDate ? new Date(formData.effectiveDate).toISOString() : null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data || err?.message || "Failed to create change"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wc-modal-backdrop">
      <div className="wc-modal wc-change-modal">
        <div className="wc-modal-header">
          <h3>Create Change Request</h3>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="wc-modal-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Change title"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" name="changeType" value={formData.changeType} onChange={handleChange}>
                <option value="ECR">ECR (Engineering Change Request)</option>
                <option value="ECN">ECN (Engineering Change Notice)</option>
                <option value="DCR">DCR (Design Change Request)</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the change"
              rows="3"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Assigned To</label>
              <input
                type="text"
                className="form-control"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                className="form-control"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Impact Assessment</label>
            <textarea
              className="form-control"
              name="impactAssessment"
              value={formData.impactAssessment}
              onChange={handleChange}
              placeholder="What parts/systems are affected?"
              rows="2"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Affected Part IDs (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              name="affectedPartIds"
              value={formData.affectedPartIds}
              onChange={handleChange}
              placeholder="e.g. 1, 2, 3"
            />
          </div>

          <div className="wc-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeCreateModal;
