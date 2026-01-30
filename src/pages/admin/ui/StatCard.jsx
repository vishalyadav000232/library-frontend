import { TrendingDown, TrendingUp } from "lucide-react";

 const StatCard = ({ title, value, icon: Icon, trend, gradient }) => (
    <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-4 sm:p-6 hover:scale-105 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-amber-700 mb-1 font-medium">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900">
            {value}
          </h3>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs sm:text-sm ${
                trend > 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="font-semibold">
                {Math.abs(trend)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
      </div>
    </div>
  );

  export default StatCard