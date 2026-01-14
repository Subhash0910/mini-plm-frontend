import React, { useState } from "react";
import PartService from "../services/PartService";
import "./createPartPanel.css";

function CreatePartPanel({ onClose, onCreated, existingPart }) {
  const isEdit = !!existingPart;

  const [partNumber, setPartNumber] = useState(existingPart?.partNumber || "");
  const [name, setName] = useState(existingPart?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Windchill-aligned: user sets identity + name only.
    // revisionSequence and lifecycleState are controlled by backend.
    const part = { partNumber, name };

    try {
      if (isEdit) {
        await PartService.updatePart(existingPart.id, part);
      } else {
        await PartService.createPart(part);
      }
      onCreated && onCreated();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Request failed";
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wc-panel-backdrop">
      <div className="wc-panel">
        <div className="wc-panel-header">
          <h3>{isEdit ? "Edit Part" : "Create Part"}</h3>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="wc-panel-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Number</label>
            <input
              type="text"
              className="form-control"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              required
              disabled={isEdit}
            />
            {isEdit && (
              <div className="form-text">
                Part number should not change after creation.
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Revision</label>
            <input
              type="text"
              className="form-control"
              value={existingPart?.revisionSequence || "1.0"}
              disabled
            />
            <div className="form-text">
              Revision is controlled by <b>Revise</b>.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Lifecycle State</label>
            <input
              type="text"
              className="form-control"
              value={existingPart?.lifecycleState || "IN_WORK"}
              disabled
            />
            <div className="form-text">
              Lifecycle is controlled by <b>Promote</b>.
            </div>
          </div>

          <div className="wc-panel-footer">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "OK"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePartPanel;
