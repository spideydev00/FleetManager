import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DistributionChartsProps {
  isDarkMode: boolean;
  chartData: {
    brandChartData: any[];
    noleggiatorePieData: any[];
    societaPieData: any[];
    alimentazionePieData: any[];
  };
  colors: {
    info: string;
  };
  pieColors: string[];
}

const DistributionCharts: React.FC<DistributionChartsProps> = ({
  isDarkMode,
  chartData,
  colors,
  pieColors,
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
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Brand Distribution */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          } p-6 rounded-lg shadow`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Distribuzione per Marca
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.brandChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="brand"
                stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vehicles" fill={colors.info} name="Veicoli" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-6 rounded-lg shadow`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Distribuzione per Noleggiatore
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.noleggiatorePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.noleggiatorePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-6 rounded-lg shadow`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Distribuzione per Società
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.societaPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.societaPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row for Alimentazione pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-6 rounded-lg shadow`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Distribuzione per Alimentazione
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.alimentazionePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.alimentazionePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placeholder for potential future chart or leave empty for better layout */}
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
};

export default DistributionCharts;
