import React, { useState, useEffect } from 'react';
import './revisionHistory.css';

const RevisionHistory = ({ partId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [partId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/parts/${partId}/history`);
      const data = await response.json();
      setHistory(data.reverse()); // Oldest first
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="revision-history">
      <h3>State Transition History</h3>
      <div className="timeline">
        {history.map((record, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="from-state">{record.fromState}</span>
                <span className="arrow">→</span>
                <span className="to-state">{record.toState}</span>
              </div>
              <div className="timeline-meta">
                <span className="date">{new Date(record.transitionDate).toLocaleString()}</span>
                <span className="by">{record.transitionedBy}</span>
              </div>
              {record.reason && <div className="reason">{record.reason}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionHistory;
