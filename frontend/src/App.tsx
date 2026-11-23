import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider} from "./context/AuthContext.tsx";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TasksPage from "./pages/TasksPage";
import AppLayout from "./layouts/AppLayout";
import RegisterPage from "./pages/RegisterPage";
import AIAssistantPage from "./pages/AIAssistantPage.tsx";

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
              <Route
                  element={
                      <ProtectedRoute>
                          <AppLayout />
                      </ProtectedRoute>
                  }
              >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
              </Route>
            <Route path="/" element={<Navigate to="/login" replace/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;