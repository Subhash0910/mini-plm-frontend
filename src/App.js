import React, { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import PartList from "./components/PartList";
import CreatePartPanel from "./components/CreatePartPanel";
import Toast from "./components/Toast";
import PartDetails from "./components/PartDetails";

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsersPage from "./components/AdminUsersPage";
import ChangesPage from "./components/ChangesPage";
import ChangeDetailsPage from "./components/ChangeDetailsPage";

import PartService from "./services/PartService";
import { auth } from "./services/auth";

function HomePage({
  showCreate,
  setShowCreate,
  editingPart,
  setEditingPart,
  reloadFlag,
  setReloadFlag,
  showToast,
}) {
  const user = auth.getUser();
  const role = user?.role;

  const canCreate = role === "ADMIN" || role === "ENGINEER";
  const canEdit = role === "ADMIN" || role === "ENGINEER";
  const canDelete = role === "ADMIN";

  const handleEditPart = (part) => {
    if (!canEdit) {
      showToast("Read-only: only ENGINEER/ADMIN can edit parts", "info");
      return;
    }
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
    if (!canDelete) {
      showToast("Only ADMIN can delete parts", "info");
      return;
    }

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
        onCreateClick={() => {
          if (!canCreate) {
            showToast("Read-only: only ENGINEER/ADMIN can create parts", "info");
            return;
          }
          setShowCreate(true);
        }}
        onEditClick={handleEditPart}
        onDeleteClick={handleDeletePart}
        reloadFlag={reloadFlag}
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

function PlaceholderPage({ title }) {
  return (
    <div className="container">
      <h3>{title}</h3>
      <p className="text-muted">Coming soon.</p>
    </div>
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
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />

        <Routes>
          <Route path="/login" element={<LoginPage showToast={showToast} />} />
          <Route path="/signup" element={<SignupPage showToast={showToast} />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                  showCreate={showCreate}
                  setShowCreate={setShowCreate}
                  editingPart={editingPart}
                  setEditingPart={setEditingPart}
                  reloadFlag={reloadFlag}
                  setReloadFlag={setReloadFlag}
                  showToast={showToast}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parts/:id"
            element={
              <ProtectedRoute>
                <PartDetails showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <AdminUsersPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Documents" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/changes"
            element={
              <ProtectedRoute>
                <ChangesPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/changes/:id"
            element={
              <ProtectedRoute>
                <ChangeDetailsPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
