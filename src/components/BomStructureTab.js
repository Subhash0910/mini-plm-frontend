import React, { useEffect, useMemo, useState } from "react";
import BomService from "../services/BomService";
import { auth } from "../services/auth";
import JsonEditorPanel from "./JsonEditorPanel";
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

  const [showEditor, setShowEditor] = useState(false);

  // Fixed: Use correct backend field names
  // - parentPartId (not partId)
  // - bomName (not name)
  // - bomLines (not lines)
  // - componentPartId (not childPartId, and must be actual part ID, not 0)
  // - lineNumber (required field)
  const editorTemplate = useMemo(() => {
    return {
      parentPartId: Number(partId),
      bomName: `BOM-${partId}`,
      bomVersion: "1.0",
      description: "",
      bomLines: [
        {
          componentPartId: 0,  // User must change this to actual part ID!
          lineNumber: 1,
          quantity: 1,
          unitOfMeasure: "EA",
          referenceDesignator: "",
          notes: "",
          sequenceNumber: 1,
        },
      ],
    };
  }, [partId]);

  const load = async () => {
    setLoading(true);
    setError("");
    setBom(null);
    setFlattened([]);

    try {
      const res = await BomService.getActiveBomForPart(partId);
      
      // FIX: Handle both null response and empty data gracefully
      // When backend returns 200 with null data, it means "no BOM found"
      if (!res || !res.data) {
        setBom(null);
        setFlattened([]);
        setError("");  // FIX: Don't show error, just show empty state
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
      
      // FIX: Don't treat "no active BOM" as an error
      // The backend now returns null instead of 500, but if we still get 404 or similar,
      // treat it as "no BOM created yet"
      if (status === 404 || message.includes("No active BOM")) {
        // Not found - this is okay, just no BOM yet
        setBom(null);
        setFlattened([]);
        setError("");
      } else {
        // Real error
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

  const upsertBom = async (payload) => {
    if (!canWrite) {
      showToast?.("Read-only: only ENGINEER/ADMIN can create or update BOM", "info");
      return;
    }

    try {
      // Validate payload structure
      if (!payload || !payload.parentPartId || !Array.isArray(payload.bomLines) || payload.bomLines.length === 0) {
        showToast?.("BOM must have parentPartId and at least one line item", "error");
        return;
      }

      if (!payload.bomName || payload.bomName.trim() === "") {
        showToast?.("BOM name is required", "error");
        return;
      }

      // FIX: Validate each BOM line BEFORE sending to backend
      // User must select actual part IDs, not leave them as 0
      for (let i = 0; i < payload.bomLines.length; i++) {
        const line = payload.bomLines[i];
        
        // Check if componentPartId is missing or is 0 (default/unselected value)
        if (!line.componentPartId || line.componentPartId === 0 || line.componentPartId === "0") {
          showToast?.(`BOM line ${i + 1} must have a valid componentPartId (select an actual part, not 0)`, "error");
          return;
        }
        
        if (!line.lineNumber) {
          showToast?.(`BOM line ${i + 1} must have a lineNumber`, "error");
          return;
        }
        
        if (!line.quantity || line.quantity <= 0) {
          showToast?.(`BOM line ${i + 1} must have a valid quantity (>0)", "error");
          return;
        }
      }

      if (bom?.id) {
        await BomService.updateBom(bom.id, payload);
        showToast?.("BOM updated successfully", "success");
      } else {
        await BomService.createBom(payload);
        showToast?.("BOM created successfully", "success");
      }

      setShowEditor(false);
      await load();
    } catch (e) {
      const message = e?.response?.data?.message || 
                     e?.response?.data || 
                     e?.message || 
                     "Failed to save BOM";
      showToast?.(String(message), "error");
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
          <button className="btn btn-sm btn-outline-secondary" onClick={load} disabled={loading}>
            Refresh
          </button>
          {canWrite && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowEditor(true)}>
              {bom?.id ? "Update BOM" : "Create BOM"}
            </button>
          )}
        </div>
      </div>

      {loading && <div className="wc-bom-info">Loading BOM structure…</div>}
      {error && <div className="wc-bom-error">{String(error)}</div>}

      {!loading && !error && !bom && (
        <div className="wc-bom-empty">
          No active BOM found for this part.
          {canWrite ? " Click 'Create BOM' to start building the structure." : ""}
        </div>
      )}

      {bom && (
        <div className="wc-bom-meta">
          <div className="wc-bom-pill">BOM ID: {bom.id}</div>
          {bom?.bomName && <div className="wc-bom-pill">Name: {bom.bomName}</div>}
          {bom?.isActive !== undefined && <div className="wc-bom-pill">Active: {String(bom.isActive)}</div>}
        </div>
      )}

      {!loading && bom && (
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

      {showEditor && (
        <JsonEditorPanel
          title={bom?.id ? "Update BOM (JSON)" : "Create BOM (JSON)"}
          initialJson={editorTemplate}
          submitLabel={bom?.id ? "Update" : "Create"}
          onSubmit={upsertBom}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

export default BomStructureTab;