import React, { useState } from 'react';
import PartService from '../services/PartService';
import './createPartPanel.css';

function CreatePartPanel({ onClose, onCreated, existingPart }) {
  const [partNumber, setPartNumber] = useState(existingPart ? existingPart.partNumber : '');
  const [name, setName] = useState(existingPart ? existingPart.name : '');
  const [version, setVersion] = useState(existingPart ? existingPart.version : 'A');
  const [lifecycleState, setLifecycleState] = useState(existingPart ? existingPart.lifecycleState : 'Draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  const part = { partNumber, name, version, lifecycleState };

  const request = isEdit
    ? PartService.updatePart(existingPart.id, part)
    : PartService.createPart(part);

  request
    .then(() => {
      setSaving(false);
      onCreated && onCreated();
    })
    .catch(() => {
      setSaving(false);
      alert(isEdit
        ? 'updated existing part.'
        : 'created new part.'
      );
      setError(isEdit
        ? 'Failed to update part. Please try again.'
        : 'Failed to create part. Please try again.'
      );
    });
};
const isEdit = !!existingPart;



  return (
    <div className="wc-panel-backdrop">
      <div className="wc-panel">
        <div className="wc-panel-header">
          <h3>Create Part</h3>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          />
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
            />
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
            <label className="form-label">Version</label>
            <input
              type="text"
              className="form-control"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Lifecycle State</label>
            <select
              className="form-select"
              value={lifecycleState}
              onChange={(e) => setLifecycleState(e.target.value)}
            >
              <option>Draft</option>
              <option>In Review</option>
              <option>Released</option>
              <option>Obsolete</option>
            </select>
          </div>

          <div className="wc-panel-footer">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'OK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePartPanel;
