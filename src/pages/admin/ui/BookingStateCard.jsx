import React from 'react'

const StatCard = ({ label, value, color, icon: Icon }) => {
  return (
    <div
      className={`${color} rounded-xl p-4 border-2 shadow-md hover:scale-105 transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
    </div>
  )
}

export default StatCard
