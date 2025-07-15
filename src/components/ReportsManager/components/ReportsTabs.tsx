import React from "react";
import { TrendingUp, BarChart3, DollarSign, Calendar, Car } from "lucide-react";

interface ReportsTabsProps {
  isDarkMode: boolean;
  activeReport: string;
  setActiveReport: (report: string) => void;
}

const ReportsTabs: React.FC<ReportsTabsProps> = ({
  isDarkMode,
  activeReport,
  setActiveReport,
}) => {
  const tabs = [
    { id: "overview", label: "Panoramica", icon: TrendingUp },
    { id: "emissions", label: "Emissioni", icon: BarChart3 },
    { id: "costs", label: "Costi", icon: DollarSign },
    { id: "contracts", label: "Contratti", icon: Calendar },
    { id: "distribution", label: "Distribuzione", icon: Car },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`px-4 py-2 flex items-center space-x-2 rounded-lg transition-colors ${
            activeReport === id
              ? isDarkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveReport(id)}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ReportsTabs;
