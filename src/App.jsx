import { Routes, Route, Navigate, BrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoutes";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Register";
import ErrorPages from "./pages/ErrorPages";
import Home from "./pages/Home";
import Loader from "./components/Loader";
import LayoutPage from "./pages/Layout";
import SeatBookingPage from "./pages/SeatBookinPage";
import Dashboard from "./pages/admin/AdminDashboord";
import BookingsPage from "./pages/admin/BookingManagment";
import BookingsPages from "./pages/BookingsPages";

function App() {
  return (
    
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

  
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/loader" element={<Loader />} />

    
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="seats" element={<SeatBookingPage />} />
        <Route path="bookings" element={<BookingsPages />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<ErrorPages />} />
    </Routes>
  );
}

export default App;
