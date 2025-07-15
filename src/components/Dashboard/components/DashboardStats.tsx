import React, { useEffect, useState } from "react";
import {
  Car,
  Clock,
  CreditCard,
  Calendar,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Driver, Order, FuelCard } from "../../../entities/types";
import { dashboardService } from "../services/dashboardService";

interface DashboardStatsProps {
  drivers: Driver[];
  orders: Order[];
  fuelCards: FuelCard[];
  isDarkMode: boolean;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  drivers,
  orders,
  fuelCards,
  isDarkMode,
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  // Optional: Implement periodic data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshData((prev) => !prev);
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get realtime stats directly from database
  useEffect(() => {
    const getRealtimeStats = async () => {
      if (isLoading) return; // Don't fetch if parent is already loading

      setLoading(true);
      try {
        await dashboardService.getRealtimeStats();
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    getRealtimeStats();
  }, [refreshData, isLoading]);

  // Calculate stats using service
  const stats = dashboardService.calculateStats(drivers, orders, fuelCards);

  // Show loading indicator for individual cards
  if (loading || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`${isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
              } p-4 rounded-xl shadow-lg border animate-pulse h-32`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  } h-12 w-12`}
              ></div>
              <div className="flex-1">
                <div
                  className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded w-24 mb-2`}
                ></div>
                <div
                  className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded w-16`}
                ></div>
              </div>
            </div>
            <div
              className={`h-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                } rounded w-32 mt-4`}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-fit pt-4 mt-2">
      {/* Total Vehicles */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${isDarkMode ? "bg-blue-900" : "bg-blue-100"
              }`}
          >
            <Car
              className={`w-6 h-6 ${isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
            />
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Veicoli Totali
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {stats.totalVehicles}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {stats.expiringVehicles > 0
              ? `${stats.expiringVehicles} veicoli in scadenza nei prossimi 6 mesi`
              : "Nessun veicolo in scadenza nei prossimi 6 mesi"}
          </p>
        </div>
      </div>

      {/* Pending Orders */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-amber-900" : "bg-amber-100"
                }`}
            >
              <Clock
                className={`w-6 h-6 ${isDarkMode ? "text-amber-300" : "text-amber-600"
                  }`}
              />
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Ordini in Attesa
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                  }`}
              >
                {stats.pendingOrders}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center ${stats.pendingOrders > 0 ? "animate-pulse" : ""
              }`}
          >
            {stats.pendingOrders > 0 && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${isDarkMode
                    ? "bg-amber-900 text-amber-200"
                    : "bg-amber-100 text-amber-800"
                  }`}
              >
                {stats.pendingOrders} in attesa
              </span>
            )}
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {orders.length - stats.pendingOrders > 0
              ? `${orders.length - stats.pendingOrders} ordini consegnati`
              : "Nessun ordine consegnato"}
          </p>
        </div>
      </div>

      {/* Fuel Cards Pending */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${isDarkMode ? "bg-green-900" : "bg-green-100"
              }`}
          >
            <CreditCard
              className={`w-6 h-6 ${isDarkMode ? "text-green-300" : "text-green-600"
                }`}
            />
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Fuel Cards Pendenti
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {stats.pendingFuelCards}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {fuelCards.length - stats.pendingFuelCards > 0
              ? `${fuelCards.length - stats.pendingFuelCards} fuel cards attive`
              : "Nessuna fuel card attiva"}
          </p>
        </div>
      </div>

      {/* Expiring Contracts */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${isDarkMode ? "bg-red-900" : "bg-red-100"
              }`}
          >
            <Calendar
              className={`w-6 h-6 ${isDarkMode ? "text-red-300" : "text-red-600"
                }`}
            />
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Contratti in Scadenza
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {stats.expiringVehicles}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Entro i prossimi 6 mesi
          </p>
        </div>
      </div>

      {/* Total Monthly Fee */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${isDarkMode ? "bg-purple-900" : "bg-purple-100"
              }`}
          >
            <TrendingUp
              className={`w-6 h-6 ${isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
            />
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Canone Mensile Totale
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {new Intl.NumberFormat("it-IT", {
                style: "currency",
                currency: "EUR",
              }).format(stats.totalMonthlyFee)}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Media:{" "}
            {new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
            }).format(stats.avgMonthlyFee)}{" "}
            per veicolo
          </p>
        </div>
      </div>

      {/* Fuel Type */}
      <div
        className={`${isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          } p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${isDarkMode ? "bg-teal-900" : "bg-teal-100"
              }`}
          >
            <Zap
              className={`w-6 h-6 ${isDarkMode ? "text-teal-300" : "text-teal-600"
                }`}
            />
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Alimentazione Principale
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              {stats.mostCommonFuelType}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {stats.maxCount} veicoli - Media:{" "}
            {Math.round(stats.averageContractKm).toLocaleString()} km
            contrattuali
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
