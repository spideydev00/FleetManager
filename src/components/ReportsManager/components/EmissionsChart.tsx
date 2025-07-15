import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EmissionsChartProps {
  isDarkMode: boolean;
  chartData: any[];
  colors: {
    primary: string;
    warning: string;
  };
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({
  isDarkMode,
  chartData,
  colors,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg border ${isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
            }`}
        >
          <p
            className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {entry.value} veicoli
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } p-6 rounded-lg shadow`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        Distribuzione Emissioni CO2
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#374151" : "#E5E7EB"}
            />
            <XAxis
              dataKey="range"
              stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
              fontSize={12}
            />
            <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="vehicles"
              fill={colors.primary}
              name="Veicoli"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmissionsChart;
