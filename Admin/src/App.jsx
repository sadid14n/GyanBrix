import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Auth/Signup";
import AdminLayout from "./component/Layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Classes from "./pages/admin/Classes";
import Subjects from "./pages/admin/Subjects";
import Chapters from "./pages/admin/Chapters";
import ViewChapter from "./pages/admin/ViewChapter";
import Login from "./pages/Auth/LoginPage";
import ProtectedRoute from "./component/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import PublicRoute from "./component/PublicRoute";
import AdminManagement from "./pages/admin/AdminManagement";
import BannerUpload from "./pages/admin/BannerUpload";
import BannerList from "./pages/admin/BannerList";

const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Home */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="classes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Classes />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="chapters"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Chapters />
            </ProtectedRoute>
          }
        />
        <Route
          path="chapters/:classId/:subjectId/:chapterId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewChapter />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="banner-upload"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BannerUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="banner-list"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BannerList />
            </ProtectedRoute>
          }
        />
        {/* <Route path="chapters" element={<Chapters />} /> */}
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default App;
