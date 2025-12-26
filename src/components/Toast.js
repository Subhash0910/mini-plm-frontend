import React from "react";
import "./toast.css";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
