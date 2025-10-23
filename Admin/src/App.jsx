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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="chapters" element={<Chapters />} />
        <Route
          path="chapters/:classId/:subjectId/:chapterId"
          element={<ViewChapter />}
        />
        {/* <Route path="chapters" element={<Chapters />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
