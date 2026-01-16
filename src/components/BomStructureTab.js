import React, { useEffect, useMemo, useState } from "react";
import BomService from "../services/BomService";
import { auth } from "../services/auth";
import "./bomStructureTab.css";

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function BomStructureTab({ partId, showToast }) {
  const user = auth.getUser();
  const role = user?.role;
  const canWrite = role === "ADMIN" || role === "ENGINEER";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bom, setBom] = useState(null);
  const [flattened, setFlattened] = useState([]);

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [bomName, setBomName] = useState("");
  const [bomVersion, setBomVersion] = useState("1.0");
  const [description, setDescription] = useState("");
  const [bomLines, setBomLines] = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    setBom(null);
    setFlattened([]);
    setIsEditing(false);

    try {
      const res = await BomService.getActiveBomForPart(partId);
      
      if (!res || !res.data) {
        setBom(null);
        setFlattened([]);
        setError("");
        return;
      }
      
      setBom(res.data);

      const bomId = res?.data?.id;
      if (bomId) {
        try {
          const flat = await BomService.getFlattenedBom(bomId);
          setFlattened(Array.isArray(flat.data) ? flat.data : []);
        } catch (flatError) {
          console.warn("Failed to load flattened BOM:", flatError);
          setFlattened([]);
        }
      }
    } catch (e) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message || 
                     e?.response?.data || 
                     e?.message || 
                     "Failed to load BOM";
      
      console.error("BOM load error:", e);
      
      if (status === 404 || message.includes("No active BOM")) {
        setBom(null);
        setFlattened([]);
        setError("");
      } else {
        setError(`Error: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partId]);

  const startEditing = () => {
    if (bom) {
      setBomName(bom.bomName || "");
      setBomVersion(bom.bomVersion || "1.0");
      setDescription(bom.description || "");
      setBomLines(bom.bomLines ? JSON.parse(JSON.stringify(bom.bomLines)) : []);
    } else {
      // Create mode
      setBomName(`BOM-${partId}`);
      setBomVersion("1.0");
      setDescription("");
      setBomLines([
        {
          componentPartId: 0,
          lineNumber: 1,
          quantity: 1,
          unitOfMeasure: "EA",
          referenceDesignator: "",
          notes: "",
          sequenceNumber: 1,
        },
      ]);
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
  };

  const addBomLine = () => {
    const newLine = {
      componentPartId: 0,
      lineNumber: bomLines.length + 1,
      quantity: 1,
      unitOfMeasure: "EA",
      referenceDesignator: "",
      notes: "",
      sequenceNumber: bomLines.length + 1,
    };
    setBomLines([...bomLines, newLine]);
  };

  const removeBomLine = (index) => {
    setBomLines(bomLines.filter((_, i) => i !== index));
  };

  const updateBomLine = (index, field, value) => {
    const updated = [...bomLines];
    updated[index] = { ...updated[index], [field]: value };
    setBomLines(updated);
  };

  const saveBom = async () => {
    if (!canWrite) {
      showToast?.("Read-only: only ENGINEER/ADMIN can create or update BOM", "info");
      return;
    }

    try {
      setError("");

      if (!bomName || bomName.trim() === "") {
        setError("BOM name is required");
        return;
      }

      if (!Array.isArray(bomLines) || bomLines.length === 0) {
        setError("BOM must have at least one line item");
        return;
      }

      // Validate each line
      for (let i = 0; i < bomLines.length; i++) {
        const line = bomLines[i];
        
        if (!line.componentPartId || line.componentPartId === 0 || line.componentPartId === "0") {
          setError(`BOM line ${i + 1}: Select a valid component part`);
          return;
        }
        
        if (!line.lineNumber) {
          setError(`BOM line ${i + 1}: Line number is required`);
          return;
        }
        
        if (!line.quantity || line.quantity <= 0) {
          setError(`BOM line ${i + 1}: Quantity must be greater than 0`);
          return;
        }
      }

      const payload = {
        parentPartId: Number(partId),
        bomName,
        bomVersion,
        description,
        bomLines,
      };

      if (bom?.id) {
        await BomService.updateBom(bom.id, payload);
        showToast?.("BOM updated successfully", "success");
      } else {
        await BomService.createBom(payload);
        showToast?.("BOM created successfully", "success");
      }

      setIsEditing(false);
      await load();
    } catch (e) {
      const message = e?.response?.data?.message || 
                     e?.response?.data || 
                     e?.message || 
                     "Failed to save BOM";
      setError(String(message));
      console.error("BOM save error:", e);
    }
  };

  return (
    <div className="wc-bom-tab">
      <div className="wc-bom-header">
        <div>
          <h3 className="wc-bom-title">Structure (BOM)</h3>
          <div className="wc-bom-sub">Active BOM for this part. Flattened view resembles structure browser.</div>
        </div>

        <div className="wc-bom-actions">
          {!isEditing ? (
            <>
              <button className="btn btn-sm btn-outline-secondary" onClick={load} disabled={loading}>
                Refresh
              </button>
              {canWrite && (
                <button className="btn btn-sm btn-primary" onClick={startEditing}>
                  {bom?.id ? "Edit BOM" : "Create BOM"}
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-outline-secondary" onClick={cancelEditing}>
                Cancel
              </button>
              <button className="btn btn-sm btn-primary" onClick={saveBom}>
                Save BOM
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <div className="wc-bom-info">Loading BOM structure…</div>}
      {error && <div className="wc-bom-error">{String(error)}</div>}

      {/* EDITING MODE - Inline Form */}
      {isEditing && (
        <div className="wc-bom-editor">
          {/* BOM Header Fields */}
          <div className="wc-bom-editor-section">
            <h4 className="wc-section-title">BOM Information</h4>
            
            <div className="wc-form-row">
              <div className="wc-form-group">
                <label className="wc-label">BOM Name</label>
                <input
                  type="text"
                  className="wc-input"
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  placeholder="e.g., Assembly-001"
                />
              </div>
              <div className="wc-form-group">
                <label className="wc-label">Version</label>
                <input
                  type="text"
                  className="wc-input"
                  value={bomVersion}
                  onChange={(e) => setBomVersion(e.target.value)}
                  placeholder="1.0"
                />
              </div>
            </div>

            <div className="wc-form-group">
              <label className="wc-label">Description</label>
              <textarea
                className="wc-input wc-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="BOM description (optional)"
                rows={3}
              />
            </div>
          </div>

          {/* BOM Lines Table */}
          <div className="wc-bom-editor-section">
            <div className="wc-section-header">
              <h4 className="wc-section-title">BOM Lines</h4>
              <button
                type="button"
                className="btn btn-xs btn-outline-primary"
                onClick={addBomLine}
              >
                + Add Line
              </button>
            </div>

            {bomLines.length === 0 ? (
              <div className="wc-bom-empty-message">No BOM lines. Click "Add Line" to add components.</div>
            ) : (
              <div className="wc-bom-lines-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>Line</th>
                      <th style={{ width: "15%" }}>Component ID</th>
                      <th style={{ width: "10%" }}>Qty</th>
                      <th style={{ width: "12%" }}>Unit</th>
                      <th style={{ width: "15%" }}>Ref Des</th>
                      <th style={{ width: "30%" }}>Notes</th>
                      <th style={{ width: "13%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomLines.map((line, idx) => (
                      <tr key={idx} className="wc-bom-line-row">
                        <td>
                          <input
                            type="number"
                            className="wc-input-sm"
                            value={line.lineNumber}
                            onChange={(e) => updateBomLine(idx, "lineNumber", Number(e.target.value))}
                            min="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="wc-input-sm"
                            value={line.componentPartId}
                            onChange={(e) => updateBomLine(idx, "componentPartId", Number(e.target.value))}
                            placeholder="Part ID"
                            min="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="wc-input-sm"
                            value={line.quantity}
                            onChange={(e) => updateBomLine(idx, "quantity", Number(e.target.value))}
                            min="1"
                          />
                        </td>
                        <td>
                          <select
                            className="wc-input-sm"
                            value={line.unitOfMeasure}
                            onChange={(e) => updateBomLine(idx, "unitOfMeasure", e.target.value)}
                          >
                            <option>EA</option>
                            <option>KG</option>
                            <option>M</option>
                            <option>L</option>
                            <option>PCS</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="wc-input-sm"
                            value={line.referenceDesignator}
                            onChange={(e) => updateBomLine(idx, "referenceDesignator", e.target.value)}
                            placeholder="U1, C1-C4"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="wc-input-sm"
                            value={line.notes}
                            onChange={(e) => updateBomLine(idx, "notes", e.target.value)}
                            placeholder="Notes"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-danger"
                            onClick={() => removeBomLine(idx)}
                            title="Remove line"
                          >
                            ✕ Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE - Display BOM */}
      {!loading && !isEditing && !error && !bom && (
        <div className="wc-bom-empty">
          No active BOM found for this part.
          {canWrite ? " Click 'Create BOM' to start building the structure." : ""}
        </div>
      )}

      {bom && !isEditing && (
        <>
          <div className="wc-bom-meta">
            <div className="wc-bom-pill">BOM ID: {bom.id}</div>
            {bom?.bomName && <div className="wc-bom-pill">Name: {bom.bomName}</div>}
            {bom?.bomVersion && <div className="wc-bom-pill">Version: {bom.bomVersion}</div>}
            {bom?.isActive !== undefined && <div className="wc-bom-pill">Active: {String(bom.isActive)}</div>}
          </div>

          {!loading && (
            <div className="wc-bom-table-wrap">
              <table className="wc-bom-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Parent</th>
                    <th>Child</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {flattened.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="wc-bom-empty-row">
                        No BOM lines (flattened view is empty).
                      </td>
                    </tr>
                  ) : (
                    flattened.map((line, idx) => (
                      <tr key={idx}>
                        <td>{safeString(line.level ?? line.depth ?? "")}</td>
                        <td>{safeString(line.parentPartNumber ?? line.parent ?? line.parentNumber ?? "")}</td>
                        <td>{safeString(line.componentPartNumber ?? line.child ?? line.childNumber ?? "")}</td>
                        <td>{safeString(line.quantity ?? line.qty ?? "")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BomStructureTab;