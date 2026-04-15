import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";
import LoginPage from "../pages/Auth/Login";
import SignupPage from "../pages/Auth/Register";
import Loader from "../components/Loader";
import AdminDashboard from "../pages/admin/AdminDashboord";
import LayoutPage from "../pages/Layout";
import Home from "../pages/Home";
import SeatBookingPage from "../pages/SeatBookinPage";
import MyBookingsPage from "../pages/MyBookingsPages";
import Profile from "../pages/Profile";
import ErrorPages from "../pages/ErrorPages";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import SeatManagement from "../pages/admin/SeatManagment";
import AdminUserManagement from "../pages/admin/AdminUserManagment";
import BookingsPage from "../pages/admin/BookingManagment";
import ReportSummaryPage from "../pages/admin/RepoetSummury";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/loader",
    element: <Loader />,
  },

  // ADMIN
{
  path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true, // default route
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "seats",
      element: <SeatManagement />,
    },
    {
      path: "users",
      element: <AdminUserManagement />,
    },
    {
      path: "bookings",
      element: <BookingsPage />,
    },
    {
      path: "reports",
      element: <ReportSummaryPage />,
    },
     {
      path: "profile",
      element: <Profile />,
    },
  ],
}
,

  // USER / STUDENT
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT", "USER"]}>
        <LayoutPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },

      {
        path: "bookings",
        element: <SeatBookingPage />,
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <ErrorPages />,
  },
]);
