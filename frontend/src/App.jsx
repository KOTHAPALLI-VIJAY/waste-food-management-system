import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";

import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonationHistory from "./pages/DonationHistory";
import ManageUsers from "./pages/ManageUsers";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      {/* Donor Routes */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute role="donor">
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute role="donor">
            <DonationHistory />
          </ProtectedRoute>
        }
      />

      {/* NGO Routes */}
      <Route
        path="/ngo"
        element={
          <ProtectedRoute role="ngo">
            <NgoDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-users"
        element={
          <ProtectedRoute role="admin">
            <ManageUsers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;