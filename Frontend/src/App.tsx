import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { StudentDashboard } from "./pages/StudentDashboard";
import { BookingPage } from "./pages/BookingPage";
import { CounselorDashboard } from "./pages/CounselorDashboard";
import { RecordFormPage } from "./pages/RecordFormPage";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counselor"
        element={
          <ProtectedRoute allowedRoles={["counselor"]}>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counselor/record/:id"
        element={
          <ProtectedRoute allowedRoles={["counselor"]}>
            <RecordFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
