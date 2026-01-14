import React, { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import PartList from "./components/PartList";
import CreatePartPanel from "./components/CreatePartPanel";
import Toast from "./components/Toast";

// If you have/created PartDetails later, import it:
// import PartDetails from "./components/PartDetails";

import PartService from "./services/PartService";

function HomePage({
  showCreate,
  setShowCreate,
  editingPart,
  setEditingPart,
  reloadFlag,
  setReloadFlag,
  showToast,
}) {
  const navigate = useNavigate();

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
      .catch((e) => {
        showToast(
          e?.response?.data?.message || e?.response?.data || "Failed to delete part",
          "error"
        );
      });
  };

  return (
    <>
      <PartList
        onCreateClick={() => setShowCreate(true)}
        onEditClick={handleEditPart}
        onDeleteClick={handleDeletePart}
        reloadFlag={reloadFlag}
        // If your PartList supports opening details:
        // onOpen={(id) => navigate(`/parts/${id}`)}
      />

      {showCreate && (
        <CreatePartPanel
          onClose={() => {
            setShowCreate(false);
            setEditingPart(null);
          }}
          onCreated={handleCreated}
          existingPart={editingPart}
        />
      )}
    </>
  );
}

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = useCallback((msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 2500);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                showCreate={showCreate}
                setShowCreate={setShowCreate}
                editingPart={editingPart}
                setEditingPart={setEditingPart}
                reloadFlag={reloadFlag}
                setReloadFlag={setReloadFlag}
                showToast={showToast}
              />
            }
          />

          {/* Add later when you create PartDetails */}
          {/* <Route path="/parts/:id" element={<PartDetails />} /> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
