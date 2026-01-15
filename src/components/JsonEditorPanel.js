import React, { useMemo, useState } from "react";
import "./jsonEditorPanel.css";

function JsonEditorPanel({ title, initialJson, onSubmit, onClose, submitLabel = "Submit" }) {
  const [raw, setRaw] = useState(() => {
    try {
      return JSON.stringify(initialJson ?? {}, null, 2);
    } catch {
      return "{}";
    }
  });

  const [error, setError] = useState("");

  const parsed = useMemo(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!parsed) {
      setError("Invalid JSON");
      return;
    }

    try {
      await onSubmit?.(parsed);
      onClose?.();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data || err?.message || "Request failed"
      );
    }
  };

  return (
    <div className="wc-panel-backdrop">
      <div className="wc-panel wc-json-panel">
        <div className="wc-panel-header">
          <h3>{title}</h3>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="wc-panel-body">
          {error && <div className="alert alert-danger">{String(error)}</div>}

          <div className="mb-3">
            <label className="form-label">Payload (JSON)</label>
            <textarea
              className="form-control wc-json-textarea"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={14}
              spellCheck={false}
            />
            <div className="form-text">
              Advanced editor: if backend validation fails, the error will show here.
            </div>
          </div>

          <div className="wc-panel-footer">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!parsed}>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JsonEditorPanel;
