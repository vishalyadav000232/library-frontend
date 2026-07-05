import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";

import LoginPage from "@/pages/Auth/Login";
import SignupPage from "@/pages/Auth/Register";

import LayoutPage from "@/pages/Layout";
import AdminLayout from "@/pages/admin/AdminLayout";

import Home from "@/pages/Home";
import SeatBookingPage from "@/pages/SeatBookinPage";
import MyBookingsPage from "@/pages/MyBookingsPages";
import Profile from "@/pages/Profile";

import Dashboard from "@/pages/admin/Dashboard";
import SeatManagement from "@/pages/admin/SeatManagment";
import AdminUserManagement from "@/pages/admin/AdminUserManagment";
import BookingsPage from "@/pages/admin/BookingManagment";
import ReportSummaryPage from "@/pages/admin/RepoetSummury";

import Loader from "@/components/Loader";
import ErrorPages from "@/pages/ErrorPages";

const AUTH_ROUTES = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
];

const ADMIN_ROUTES = [
  {
    index: true,
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
];

const USER_ROUTES = [
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
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  ...AUTH_ROUTES,

  {
    path: "/loader",
    element: <Loader />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: ADMIN_ROUTES,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT", "USER"]}>
        <LayoutPage />
      </ProtectedRoute>
    ),
    children: USER_ROUTES,
  },

  {
    path: "*",
    element: <ErrorPages />,
  },
]);