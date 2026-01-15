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

  const editorTemplate = useMemo(() => {
    return {
      partId: Number(partId),
      name: `BOM-${partId}`,
      lines: [
        {
          childPartId: 0,
          quantity: 1,
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
      
      if (!res || !res.data) {
        setBom(null);
        setFlattened([]);
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
      
      if (status === 404) {
        // Not found - this is okay, just no BOM yet
        setBom(null);
        setFlattened([]);
        setError("");
      } else if (status === 500 || status === undefined) {
        // Server error or network error
        console.error("BOM load error:", e);
        setError(`Server error: ${message}`);
      } else {
        setError(String(message));
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
      // Validate payload
      if (!payload || !payload.partId || !Array.isArray(payload.lines) || payload.lines.length === 0) {
        showToast?.("BOM must have partId and at least one line item", "error");
        return;
      }

      if (!payload.name || payload.name.trim() === "") {
        showToast?.("BOM name is required", "error");
        return;
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
          {canWrite ? " Create one to start building structure." : ""}
        </div>
      )}

      {bom && (
        <div className="wc-bom-meta">
          <div className="wc-bom-pill">BOM ID: {bom.id}</div>
          {bom?.name && <div className="wc-bom-pill">Name: {bom.name}</div>}
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
                    <td>{safeString(line.childPartNumber ?? line.child ?? line.childNumber ?? "")}</td>
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
