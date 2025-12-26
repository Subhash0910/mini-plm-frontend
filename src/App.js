import React, { useState } from "react";
import Layout from "./components/Layout";
import PartList from "./components/PartList";
import CreatePartPanel from "./components/CreatePartPanel";
import Toast from "./components/Toast";

import PartService from "./services/PartService";

function App() {

  const [showCreate, setShowCreate] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);

    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setShowCreate(true);
  };

  const handleCreated = () => {
    setShowCreate(false);
    setEditingPart(null);
    setReloadFlag(!reloadFlag);
    showToast(editingPart ? "Part updated successfully" : "Part created successfully");
  };

  const handleDeletePart = (id) => {
    if (!window.confirm("Delete this part?")) return;

    PartService.deletePart(id)
      .then(() => {
        setReloadFlag(!reloadFlag);
        showToast("Part deleted successfully", "info");
      })
      .catch(() => showToast("Failed to delete part", "error"));
  };

  return (
    <Layout>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />

      <PartList
        onCreateClick={() => setShowCreate(true)}
        onEditClick={handleEditPart}
        onDeleteClick={handleDeletePart}
        reloadFlag={reloadFlag}
      />

      {showCreate && (
        <CreatePartPanel
          onClose={() => { setShowCreate(false); setEditingPart(null); }}
          onCreated={handleCreated}
          existingPart={editingPart}
        />
      )}
    </Layout>
  );
}

export default App;
