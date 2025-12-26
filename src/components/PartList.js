import React, { useState, useEffect } from 'react';
import PartService from '../services/PartService';

function PartList({ onCreateClick, onEditClick, onDeleteClick, reloadFlag }) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    PartService.getAllParts()
      .then((response) => {
        setParts(response.data);
      })
      .catch(() => {
        setParts([]);
      });
  }, [reloadFlag]);

  return (
    <div className="wc-card">
      <div className="wc-table-header">
        <h2 className="wc-table-title">Part List</h2>
        <div className="wc-table-actions">
          <button
            className="btn btn-sm btn-primary"
            onClick={onCreateClick}
          >
            Create Part
          </button>
          <button className="btn btn-sm btn-outline-secondary ms-2">
            Export List
          </button>
        </div>
      </div>

      {parts.length === 0 ? (
        <div className="wc-empty">
          No parts yet. Click <strong>Create Part</strong> to add one.
        </div>
      ) : (
                    <table className="table table-striped table-sm wc-table">
            <thead>
                <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Version</th>
                <th>State</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {parts.map((part) => (
                <tr key={part.id}>
                    <td>{part.partNumber}</td>
                    <td>{part.name}</td>
                    <td>{part.version}</td>
                    <td>{part.lifecycleState}</td>
                    <td>
                    <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => onEditClick(part)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteClick(part.id)}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
      )}
    </div>
  );
}

export default PartList;
