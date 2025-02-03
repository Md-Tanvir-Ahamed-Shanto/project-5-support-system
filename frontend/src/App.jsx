import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/common/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import AgentPage from "./components/agent/AgentPage";
import ComplaintForm from "./components/customers/ComplainForm";


function App() {
  return (
    <div className="w-full h-full">
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <AgentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/submit/:id" element={<UserSubmitForm />} /> */}
          <Route path="/" element={<ComplaintForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
