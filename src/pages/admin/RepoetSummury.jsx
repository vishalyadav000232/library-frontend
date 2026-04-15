import React, { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  IndianRupee,
  BarChart3,
  PieChart,
  FileText,
  Filter,
  RefreshCw,
  ChevronDown,
  Eye,
  X,
  Clock,
  MapPin,
  BookOpen,
} from "lucide-react";
import {
  generateReport,
  generateReportExcel,
  generateReportPdf,
} from "../../Api/reports";
import AnalyticsCard from "./ui/AnalyticsCard";

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [reportType, setReportType] = useState("overview");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Analytics Data
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeUsers: 0,
    occupancyRate: 0,
    revenueGrowth: 0,
    bookingGrowth: 0,
  });

  // Report Data
  const [reportData, setReportData] = useState({
    dailyRevenue: [],
    topSeats: [],
    shiftDistribution: [],
    paymentStatus: [],
    userActivity: [],
    monthlyTrends: [],
  });

  // Load Analytics
  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      // const data = await getReports({ type: "analytics", ...dateRange });

      // MOCK DATA - Replace with actual API call
      const mockAnalytics = {
        totalRevenue: 245800,
        totalBookings: 1247,
        activeUsers: 523,
        occupancyRate: 78.5,
        revenueGrowth: 12.5,
        bookingGrowth: 8.3,
      };

      const mockReportData = {
        dailyRevenue: [
          { date: "2024-02-01", revenue: 12400, bookings: 45 },
          { date: "2024-02-02", revenue: 15600, bookings: 52 },
          { date: "2024-02-03", revenue: 13200, bookings: 48 },
          { date: "2024-02-04", revenue: 16800, bookings: 58 },
          { date: "2024-02-05", revenue: 14500, bookings: 51 },
        ],
        topSeats: [
          {
            seat: "A-101",
            floor: "Ground Floor",
            bookings: 89,
            revenue: 26700,
          },
          { seat: "B-205", floor: "First Floor", bookings: 76, revenue: 22800 },
          {
            seat: "A-103",
            floor: "Ground Floor",
            bookings: 71,
            revenue: 21300,
          },
          {
            seat: "C-301",
            floor: "Second Floor",
            bookings: 68,
            revenue: 20400,
          },
          { seat: "B-208", floor: "First Floor", bookings: 65, revenue: 19500 },
        ],
        shiftDistribution: [
          { shift: "Morning", count: 456, percentage: 36.5, revenue: 91200 },
          { shift: "Evening", count: 521, percentage: 41.8, revenue: 104200 },
          { shift: "Night", count: 270, percentage: 21.7, revenue: 50400 },
        ],
        paymentStatus: [
          { status: "Paid", count: 1089, percentage: 87.3, amount: 217800 },
          { status: "Pending", count: 123, percentage: 9.9, amount: 24600 },
          { status: "Refunded", count: 35, percentage: 2.8, amount: 3400 },
        ],
        userActivity: [
          {
            name: "Rahul Sharma",
            bookings: 45,
            revenue: 13500,
            status: "Active",
          },
          {
            name: "Priya Patel",
            bookings: 38,
            revenue: 11400,
            status: "Active",
          },
          {
            name: "Amit Kumar",
            bookings: 35,
            revenue: 10500,
            status: "Active",
          },
          {
            name: "Sneha Singh",
            bookings: 32,
            revenue: 9600,
            status: "Active",
          },
          { name: "Vikram Rao", bookings: 28, revenue: 8400, status: "Active" },
        ],
        monthlyTrends: [
          { month: "Jan 2024", revenue: 185000, bookings: 890, growth: 5.2 },
          { month: "Feb 2024", revenue: 245800, bookings: 1247, growth: 12.5 },
        ],
      };

      setAnalytics(mockAnalytics);
      setReportData(mockReportData);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load analytics";
      setError(msg);
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const downloadReport = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ! report generate and export handlers

  const handleGenerateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select start and end date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const report = await generateReport(
        reportType,
        dateRange.startDate,
        dateRange.endDate,
      );

      setSuccess("Report generated successfully! ✅");
      setTimeout(() => setSuccess(""), 3000);

      downloadReport(report);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to generate report";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  //!  Export to pdf

  const handleDownloadPDF = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select start and end date");
      return;
    }

    try {
      setLoading(true);

      const blob = await generateReportPdf(
        reportType,
        dateRange.startDate,
        dateRange.endDate,
      );

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `${reportType}_report.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //! Export to Excel

  const handleExportCSV = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select start and end date");
      return;
    }

    try {
      setLoading(true);

      const blob = await generateReportExcel(
        reportType,
        dateRange.startDate,
        dateRange.endDate,
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}_report.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Export failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">
              Reports & Analytics
            </h1>
            <p className="text-amber-700 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-semibold shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-semibold shadow-md"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl font-semibold">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl font-semibold">
            ✅ {success}
          </div>
        )}

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-900">Date Range:</span>
            </div>

            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            />

            <span className="text-amber-600 font-semibold">to</span>

            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            />

            <button
              onClick={loadAnalytics}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-semibold"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title="Total Revenue"
            value={`₹${analytics.totalRevenue.toLocaleString("en-IN")}`}
            subtitle="This period"
            icon={IndianRupee}
            color="bg-gradient-to-br from-green-100 to-emerald-100 text-green-900 border-green-300"
            growth={analytics.revenueGrowth}
          />

          <AnalyticsCard
            title="Total Bookings"
            value={analytics.totalBookings.toLocaleString("en-IN")}
            subtitle="Confirmed bookings"
            icon={BookOpen}
            color="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-900 border-blue-300"
            growth={analytics.bookingGrowth}
          />

          <AnalyticsCard
            title="Active Users"
            value={analytics.activeUsers.toLocaleString("en-IN")}
            subtitle="Regular customers"
            icon={Users}
            color="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900 border-purple-300"
          />

          <AnalyticsCard
            title="Occupancy Rate"
            value={`${analytics.occupancyRate}%`}
            subtitle="Average utilization"
            icon={TrendingUp}
            color="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 border-amber-300"
          />
        </div>

       
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-amber-900">
              Generate Custom Report
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            >
              <option value="overview">Overview Report</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="bookings">Bookings Report</option>
              <option value="users">User Activity</option>
              <option value="seats">Seat Utilization</option>
              <option value="shifts">Shift Analysis</option>
              <option value="payments">Payment Status</option>
            </select>

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="px-6 py-3 border-2 border-amber-300 text-amber-700 rounded-lg  hover:bg-amber-00 transition delay-75 ease-in  font-semibold"
            >
             <Download className="w-4 h-4 inline mr-2" />
             Export Json
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 border-2 border-amber-300 text-amber-700 rounded-lg  hover:from-amber-700 hover:to-orange-700 transition font-semibold"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export PDF
            </button>

            <button
              onClick={handleExportCSV}
              className="px-6 py-3 border-2 border-amber-300 text-amber-700 rounded-lg  hover:from-amber-700 hover:to-orange-700 transition font-semibold"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export Excel
            </button>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 p-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">
                Top Performing Seats
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50 border-b-2 border-amber-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Seat Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Floor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Total Bookings
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.topSeats.map((seat, index) => (
                  <tr
                    key={seat.seat}
                    className="border-b border-amber-100 hover:bg-amber-50 transition"
                  >
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-900">
                      {seat.seat}
                    </td>
                    <td className="py-4 px-4 text-amber-800">{seat.floor}</td>
                    <td className="py-4 px-4 font-semibold text-amber-900">
                      {seat.bookings}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-700 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {seat.revenue.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-amber-100 rounded-lg transition">
                        <Eye className="w-4 h-4 text-amber-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
          <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-700" />
                <h2 className="text-xl font-bold text-amber-900">
                  Shift Distribution
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {reportData.shiftDistribution.map((shift) => (
                <div key={shift.shift} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-900">
                      {shift.shift}
                    </span>
                    <span className="text-sm text-amber-700">
                      {shift.count} bookings ({shift.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-orange-600 h-full rounded-full transition-all"
                      style={{ width: `${shift.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-700 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    {shift.revenue.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 p-6">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-amber-700" />
                <h2 className="text-xl font-bold text-amber-900">
                  Payment Status
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {reportData.paymentStatus.map((payment) => (
                <div key={payment.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-900">
                      {payment.status}
                    </span>
                    <span className="text-sm text-amber-700">
                      {payment.count} payments ({payment.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        payment.status === "Paid"
                          ? "bg-gradient-to-r from-green-600 to-emerald-600"
                          : payment.status === "Pending"
                            ? "bg-gradient-to-r from-yellow-600 to-amber-600"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600"
                      }`}
                      style={{ width: `${payment.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-700 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    {payment.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Users Activity */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">
                Top Active Users
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50 border-b-2 border-amber-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Total Bookings
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Total Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-amber-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.userActivity.map((user, index) => (
                  <tr
                    key={user.name}
                    className="border-b border-amber-100 hover:bg-amber-50 transition"
                  >
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-amber-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-amber-900">
                      {user.bookings}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-700 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {user.revenue.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-amber-100 rounded-lg transition">
                        <Eye className="w-4 h-4 text-amber-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">
                Monthly Trends
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {reportData.monthlyTrends.map((month) => (
                <div
                  key={month.month}
                  className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-amber-900 text-lg">
                      {month.month}
                    </h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-bold">
                        +{month.growth}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-amber-700 font-semibold mb-1">
                        Revenue
                      </p>
                      <p className="text-2xl font-bold text-green-700 flex items-center gap-1">
                        <IndianRupee className="w-5 h-5" />
                        {month.revenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-700 font-semibold mb-1">
                        Bookings
                      </p>
                      <p className="text-2xl font-bold text-amber-900">
                        {month.bookings.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
