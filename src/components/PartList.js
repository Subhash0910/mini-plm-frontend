import React, { useEffect, useMemo, useRef, useState } from "react";
import PartService from "../services/PartService";
import StateIndicator from "./StateIndicator";
import "./partList.css";

const EDITABLE_STATES = new Set(["IN_WORK", "PROTOTYPE_IN_WORK", "PROTOTYPE"]);
const PROMOTABLE_STATES = new Set(["IN_WORK", "PROTOTYPE_IN_WORK", "PROTOTYPE"]);

function parseRevisionNumber(seq) {
  if (!seq) return 0;
  const n = parseInt(String(seq).split(".")[0], 10);
  return Number.isFinite(n) ? n : 0;
}

function extractPartsList(data) {
  // Backend returns Page<PartResponse> for GET /parts
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

function PartList({ onCreateClick, onEditClick, onDeleteClick, reloadFlag }) {
  const [parts, setParts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showAllVersions, setShowAllVersions] = useState(false);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [activePart, setActivePart] = useState(null);
  const popoverRef = useRef(null);

  const transitionedBy = "sam";

  const loadParts = async (state = "") => {
    setLoading(true);
    setActionError("");
    try {
      const res = await PartService.getAllParts(state);
      setParts(extractPartsList(res.data));
    } catch (err) {
      setParts([]);
      setActionError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Failed to load parts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts(selectedState);
  }, [reloadFlag, selectedState]);

  const displayedParts = useMemo(() => {
    if (showAllVersions) return parts;

    const map = new Map();
    for (const p of parts) {
      const key = p.partNumber;
      if (!key) continue;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, p);
        continue;
      }

      const pRev = Number.isFinite(p.revisionNumber)
        ? p.revisionNumber
        : parseRevisionNumber(p.revisionSequence);

      const eRev = Number.isFinite(existing.revisionNumber)
        ? existing.revisionNumber
        : parseRevisionNumber(existing.revisionSequence);

      if (pRev > eRev) map.set(key, p);
    }

    return Array.from(map.values()).sort((a, b) =>
      String(a.partNumber).localeCompare(String(b.partNumber))
    );
  }, [parts, showAllVersions]);

  const closePopover = () => {
    setPopoverVisible(false);
    setActivePart(null);
  };

  const openPopover = (event, part) => {
    event.stopPropagation();

    const menuWidth = 200;
    const menuHeight = 260;
    const padding = 8;

    let left = event.clientX - menuWidth;
    let top = event.clientY + 8;

    left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - menuHeight - padding));

    setPopoverPosition({ top, left });
    setActivePart(part);
    setPopoverVisible(true);
  };

  const promote = async (id) => {
    setActionError("");
    closePopover();
    try {
      await PartService.promotePart(id, transitionedBy);
      await loadParts(selectedState);
    } catch (err) {
      setActionError(err?.response?.data || err?.message || "Promote failed");
    }
  };

  const revise = async (id) => {
    setActionError("");
    closePopover();
    try {
      await PartService.revisePart(id, transitionedBy);
      await loadParts(selectedState);
    } catch (err) {
      setActionError(err?.response?.data || err?.message || "Revise failed");
    }
  };

  const markObsolete = async (id) => {
    setActionError("");
    closePopover();
    try {
      await PartService.obsoletePart(id, transitionedBy);
      await loadParts(selectedState);
    } catch (err) {
      setActionError(err?.response?.data || err?.message || "Obsolete failed");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        closePopover();
      }
    };
    if (popoverVisible) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverVisible]);

  return (
    <div className="plm-parts-container">
      <div className="plm-toolbar">
        <h1 className="plm-title">Parts</h1>

        <div className="plm-toolbar-actions">
          <select
            className="plm-filter-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            <option value="IN_WORK">In Work</option>
            <option value="PROTOTYPE_IN_WORK">Prototype In Work</option>
            <option value="PROTOTYPE">Prototype</option>
            <option value="RELEASED">Released</option>
            <option value="OBSOLETE">Obsolete</option>
          </select>

          <label className="plm-checkbox-label">
            <input
              type="checkbox"
              checked={showAllVersions}
              onChange={(e) => setShowAllVersions(e.target.checked)}
            />
            Show all versions
          </label>

          <button className="plm-btn plm-btn-primary" onClick={onCreateClick}>
            + Create Part
          </button>
        </div>
      </div>

      {actionError && (
        <div className="plm-alert plm-alert-danger">
          <span>{String(actionError)}</span>
          <button className="plm-alert-close" onClick={() => setActionError("")}>
            ×
          </button>
        </div>
      )}

      {loading && <div className="plm-empty-state">Loading parts...</div>}

      {!loading && displayedParts.length === 0 && (
        <div className="plm-empty-state">No parts found</div>
      )}

      {!loading && displayedParts.length > 0 && (
        <table className="plm-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Revision</th>
              <th>State</th>
              <th style={{ width: "80px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedParts.map((part) => (
              <tr key={part.id} className="plm-table-row">
                <td className="plm-part-number">
                  <span className="plm-link">{part.partNumber}</span>
                </td>

                <td>{part.name}</td>
                <td className="plm-revision">{part.revisionSequence}</td>

                <td>
                  <StateIndicator state={part.lifecycleState} />
                </td>

                <td className="plm-actions-cell">
                  <button
                    className="plm-dropdown-toggle"
                    onClick={(e) => openPopover(e, part)}
                    title="Actions"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {popoverVisible && activePart && (
        <div
          ref={popoverRef}
          className="plm-popover"
          style={{ top: popoverPosition.top, left: popoverPosition.left }}
        >
          <button
            className="plm-popover-item"
            onClick={() => {
              closePopover();
              if (EDITABLE_STATES.has(activePart.lifecycleState)) onEditClick?.(activePart);
            }}
          >
            📄 Open
          </button>

          {EDITABLE_STATES.has(activePart.lifecycleState) && (
            <button
              className="plm-popover-item"
              onClick={() => {
                closePopover();
                onEditClick?.(activePart);
              }}
            >
              ✏️ Edit
            </button>
          )}

          {PROMOTABLE_STATES.has(activePart.lifecycleState) && (
            <button className="plm-popover-item" onClick={() => promote(activePart.id)}>
              ⬆️ Promote
            </button>
          )}

          {EDITABLE_STATES.has(activePart.lifecycleState) && (
            <button className="plm-popover-item" onClick={() => revise(activePart.id)}>
              🔄 Revise
            </button>
          )}

          {activePart.lifecycleState !== "OBSOLETE" &&
            activePart.lifecycleState !== "RELEASED" && (
              <button
                className="plm-popover-item plm-popover-item-danger"
                onClick={() => markObsolete(activePart.id)}
              >
                ⛔ Mark Obsolete
              </button>
            )}

          {activePart.lifecycleState === "IN_WORK" && (
            <button
              className="plm-popover-item plm-popover-item-danger"
              onClick={() => {
                closePopover();
                onDeleteClick?.(activePart.id);
              }}
            >
              🗑️ Delete
            </button>
          )}

          {activePart.lifecycleState === "RELEASED" && (
            <div className="plm-popover-item plm-popover-item-disabled">🔒 Locked</div>
          )}
        </div>
      )}
    </div>
  );
}

export default PartList;
