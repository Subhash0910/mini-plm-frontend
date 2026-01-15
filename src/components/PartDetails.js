import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PartService from "../services/PartService";
import StateIndicator from "./StateIndicator";
import BomStructureTab from "./BomStructureTab";
import "./partDetails.css";

function PartDetails({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const loadPart = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await PartService.getPartById(id);
        setPart(res.data);

        const histRes = await PartService.getPartHistory(id);
        setHistory(Array.isArray(histRes.data) ? histRes.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data ||
            err?.message ||
            "Failed to load part"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPart();
  }, [id]);

  if (loading) return <div className="plm-page-loading">Loading...</div>;
  if (error) return <div className="plm-page-error">{error}</div>;
  if (!part) return <div className="plm-page-error">Part not found</div>;

  return (
    <div className="plm-details-page">
      <div className="plm-details-header">
        <button className="plm-btn-back" onClick={() => navigate("/")} type="button">
          ← Back
        </button>
        <div className="plm-details-title">
          <h1 className="plm-h1">{part.partNumber}</h1>
          <StateIndicator state={part.lifecycleState} />
        </div>
      </div>

      <div className="plm-tabs">
        <button
          className={`plm-tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
          type="button"
        >
          Details
        </button>
        <button
          className={`plm-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
          type="button"
        >
          History
        </button>
        <button
          className={`plm-tab ${activeTab === "structure" ? "active" : ""}`}
          onClick={() => setActiveTab("structure")}
          type="button"
        >
          Structure (BOM)
        </button>
      </div>

      <div className="plm-tab-content">
        {activeTab === "details" && (
          <div className="plm-details-form">
            <div className="plm-form-group">
              <label>Part Number</label>
              <p>{part.partNumber}</p>
            </div>

            <div className="plm-form-group">
              <label>Name</label>
              <p>{part.name}</p>
            </div>

            <div className="plm-form-group">
              <label>Description</label>
              <p>{part.description || "—"}</p>
            </div>

            <div className="plm-form-row">
              <div className="plm-form-group">
                <label>Revision</label>
                <p>{part.revisionSequence}</p>
              </div>

              <div className="plm-form-group">
                <label>State</label>
                <p>
                  <StateIndicator state={part.lifecycleState} />
                </p>
              </div>
            </div>

            <div className="plm-form-row">
              <div className="plm-form-group">
                <label>Created By</label>
                <p>{part.createdBy || "—"}</p>
              </div>

              <div className="plm-form-group">
                <label>Created</label>
                <p>
                  {part.createdDate
                    ? new Date(part.createdDate).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <div className="plm-form-row">
              <div className="plm-form-group">
                <label>Last Modified</label>
                <p>
                  {part.lastModifiedDate
                    ? new Date(part.lastModifiedDate).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="plm-form-group">
                <label>Last Modified By</label>
                <p>{part.lastModifiedBy || "—"}</p>
              </div>
            </div>

            {part.releasedDate && (
              <div className="plm-form-group">
                <label>Released</label>
                <p>{new Date(part.releasedDate).toLocaleString()}</p>
              </div>
            )}

            {part.obsoleteDate && (
              <div className="plm-form-group">
                <label>Obsolete</label>
                <p>{new Date(part.obsoleteDate).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="plm-history-list">
            {history.length === 0 ? (
              <p className="plm-empty">No transitions recorded</p>
            ) : (
              <ul>
                {history.map((h, i) => (
                  <li key={i} className="plm-history-item">
                    <span className="plm-history-date">
                      {h?.transitionDate
                        ? new Date(h.transitionDate).toLocaleString()
                        : "—"}
                    </span>
                    <span className="plm-history-action">
                      {h.fromState} → {h.toState}
                    </span>
                    <span className="plm-history-user">{h.transitionedBy}</span>
                    {h.reason && (
                      <span className="plm-history-reason">{h.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "structure" && <BomStructureTab partId={id} showToast={showToast} />}
      </div>
    </div>
  );
}

export default PartDetails;
