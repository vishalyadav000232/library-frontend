
import React from 'react'
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
const AnalyticsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    growth,
  }) => {
  return (
     <div
      className={`${color} rounded-xl p-6 border-2 shadow-lg hover:scale-105 transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {growth !== undefined && (
        <div className="flex items-center gap-1 text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>
            {growth > 0 ? "+" : ""}
            {growth}% from last month
          </span>
        </div>
      )}
    </div>
  )
}

export default AnalyticsCard
