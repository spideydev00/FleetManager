import React from "react";
import {
  Car,
  BarChart3,
  DollarSign,
  Calendar,
} from "lucide-react";

interface OverviewStatsProps {
  isDarkMode: boolean;
  fleetStats: {
    totalVehicles: number;
    brandCount: number;
    avgMonthlyFee: number;
    expiringContracts: number;
    minEmissions: number;
    avgEmissions: number;
    maxEmissions: number;
    minMonthlyFee: number;
    maxMonthlyFee: number;
  };
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
  isDarkMode,
  fleetStats,
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-4 rounded-lg shadow`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-blue-900" : "bg-blue-100"
                }`}
            >
              <Car
                className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                size={24}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
              >
                Veicoli Totali
              </h3>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                  }`}
              >
                {fleetStats.totalVehicles}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-4 rounded-lg shadow`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-green-900" : "bg-green-100"
                }`}
            >
              <BarChart3
                className={isDarkMode ? "text-green-400" : "text-green-600"}
                size={24}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
              >
                Marche Diverse
              </h3>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                  }`}
              >
                {fleetStats.brandCount}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-4 rounded-lg shadow`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-yellow-900" : "bg-yellow-100"
                }`}
            >
              <DollarSign
                className={isDarkMode ? "text-yellow-400" : "text-yellow-600"}
                size={24}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
              >
                Canone Medio
              </h3>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                  }`}
              >
                €{fleetStats.avgMonthlyFee}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-4 rounded-lg shadow`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-red-900" : "bg-red-100"
                }`}
            >
              <Calendar
                className={isDarkMode ? "text-red-400" : "text-red-600"}
                size={24}
              />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
              >
                In Scadenza (6m)
              </h3>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                  }`}
              >
                {fleetStats.expiringContracts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            } p-6 rounded-lg shadow`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Statistiche Emissioni
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
              >
                {fleetStats.minEmissions}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Min g/km
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
              >
                {fleetStats.avgEmissions}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Media g/km
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
              >
                {fleetStats.maxEmissions}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Max g/km
              </p>
            </div>
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
            Statistiche Canoni
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
              >
                €{fleetStats.minMonthlyFee}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Minimo
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
              >
                €{fleetStats.avgMonthlyFee}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Media
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
              >
                €{fleetStats.maxMonthlyFee}
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Massimo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;