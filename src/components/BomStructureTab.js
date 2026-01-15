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
      setBom(res.data);

      const bomId = res?.data?.id;
      if (bomId) {
        const flat = await BomService.getFlattenedBom(bomId);
        setFlattened(Array.isArray(flat.data) ? flat.data : []);
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        setBom(null);
        setFlattened([]);
      } else {
        setError(e?.response?.data?.message || e?.response?.data || e?.message || "Failed to load BOM");
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

    if (bom?.id) {
      await BomService.updateBom(bom.id, payload);
      showToast?.("BOM updated", "success");
    } else {
      await BomService.createBom(payload);
      showToast?.("BOM created", "success");
    }

    await load();
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

      {loading && <div className="wc-bom-info">Loading…</div>}
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
