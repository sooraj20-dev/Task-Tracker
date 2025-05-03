import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import CalendarView from "./pages/CalendarView";
import ActivityLog from "./pages/ActivityLog";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

function App() {
  return (
    <Routes>
      {/* Redirect root path to /authpage */}
      <Route path="/" element={<Navigate to="/authpage" replace />} />

      {/* Public route */}
      <Route path="/authpage" element={<AuthPage />} />

      {/* Protected routes with Layout and PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/activities" element={<ActivityLog />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/authpage" replace />} />
    </Routes>
  );
}

export default App;
