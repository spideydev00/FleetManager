import React, { useState, useMemo } from "react";
import { Driver } from "../../entities/types";
import { reportsService } from "./services/reportsService";
import ReportsHeader from "./components/ReportsHeader";
import ReportsFilters from "./components/ReportsFilters";
import { FilterConfig } from "./components/filters/FilterItem";
import ReportsTabs from "./components/ReportsTabs";
import OverviewStats from "./components/OverviewStats";
import EmissionsChart from "./components/EmissionsChart";
import CostsChart from "./components/CostsChart";
import ContractsChart from "./components/ContractsChart";
import DistributionCharts from "./components/DistributionCharts";

interface ReportsManagerProps {
  drivers: Driver[];
  isDarkMode: boolean;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({
  drivers,
  isDarkMode,
}) => {
  const [activeReport, setActiveReport] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterConfig[]>([]);

  // Colors for charts
  const COLORS = {
    primary: isDarkMode ? "#3B82F6" : "#2563EB",
    secondary: isDarkMode ? "#10B981" : "#059669",
    accent: isDarkMode ? "#F59E0B" : "#D97706",
    danger: isDarkMode ? "#EF4444" : "#DC2626",
    warning: isDarkMode ? "#F59E0B" : "#D97706",
    success: isDarkMode ? "#10B981" : "#059669",
    info: isDarkMode ? "#06B6D4" : "#0891B2",
    purple: isDarkMode ? "#8B5CF6" : "#7C3AED",
    pink: isDarkMode ? "#EC4899" : "#DB2777",
    indigo: isDarkMode ? "#6366F1" : "#4F46E5",
  };

  const PIE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.danger,
    COLORS.warning,
    COLORS.info,
    COLORS.purple,
    COLORS.pink,
    COLORS.indigo,
  ];

  // Apply filters to drivers
  const filteredDrivers = useMemo(() => {
    if (activeFilters.length === 0) return drivers;

    return drivers.filter((driver) => {
      return activeFilters.every((filter) => {
        let driverValue: any;

        switch (filter.field) {
          case "noleggiatore":
            driverValue = driver.noleggiatore || "";
            break;
          case "societa":
            driverValue = driver.societa || "";
            break;
          case "alimentazione":
            driverValue = driver.alimentazione || "";
            break;
          case "marca":
            driverValue = driver.marca || "";
            break;
          case "scadenzaContratto":
            driverValue = driver.scadenzaContratto
              ? new Date(driver.scadenzaContratto)
              : null;
            break;
          case "canoneMensile":
            driverValue = driver.canoneMensile || 0;
            break;
          case "kmContrattuali":
            driverValue = driver.kmContrattuali || 0;
            break;
          case "emissioni":
            const emissionsMatch = driver.emissioni.match(/(\d+(?:\.\d+)?)/);
            driverValue = emissionsMatch ? parseFloat(emissionsMatch[1]) : 0;
            break;
          default:
            return true;
        }

        // Apply filter based on type and operator
        if (filter.type === "string") {
          return (
            driverValue
              .toString()
              .toLowerCase() === filter.value.toString().toLowerCase()
          );
        }

        if (filter.type === "number") {
          const filterValue = Number(filter.value);
          switch (filter.operator) {
            case "=":
              return driverValue === filterValue;
            case ">":
              return driverValue > filterValue;
            case "<":
              return driverValue < filterValue;
            case ">=":
              return driverValue >= filterValue;
            case "<=":
              return driverValue <= filterValue;
            default:
              return true;
          }
        }

        if (filter.type === "date" && driverValue) {
          const filterDate = new Date(filter.value.toString());
          switch (filter.operator) {
            case "=":
              return driverValue.toDateString() === filterDate.toDateString();
            case ">":
              return driverValue > filterDate;
            case "<":
              return driverValue < filterDate;
            default:
              return true;
          }
        }

        return true;
      });
    });
  }, [drivers, activeFilters]);

  // Calculate statistics based on filtered data
  const fleetStats = useMemo(() => {
    return reportsService.calculateFleetStatistics(filteredDrivers);
  }, [filteredDrivers]);

  // Generate chart data based on filtered data
  const chartData = useMemo(() => {
    return reportsService.generateChartData(filteredDrivers);
  }, [filteredDrivers]);

  // Function to export data to Excel
  const exportToExcel = async () => {
    const dataToExport = activeFilters.length > 0 ? filteredDrivers : drivers;
    const filename = activeFilters.length > 0
      ? `fleet_report_filtered_${new Date().toISOString().split("T")[0]}.xlsx`
      : `fleet_report_${new Date().toISOString().split("T")[0]}.xlsx`;

    const { success, error } = await reportsService.exportToExcel(dataToExport, filename);
    if (error) {
      console.error("Error exporting to Excel:", error);
      // Potresti aggiungere qui una notifica di errore per l'utente
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReportsHeader
        isDarkMode={isDarkMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onExportExcel={exportToExcel}
        hasActiveFilters={activeFilters.length > 0}
        filteredCount={filteredDrivers.length}
        totalCount={drivers.length}
      />

      {/* Filter Panel */}
      <ReportsFilters
        isDarkMode={isDarkMode}
        isVisible={showFilters}
        drivers={drivers}
        onFiltersChange={setActiveFilters}
      />

      {/* Report Tabs */}
      <ReportsTabs
        isDarkMode={isDarkMode}
        activeReport={activeReport}
        setActiveReport={setActiveReport}
      />

      {/* Results Summary */}
      {activeFilters.length > 0 && (
        <div
          className={`p-4 rounded-lg ${isDarkMode
            ? "bg-blue-900 border border-blue-700"
            : "bg-blue-50 border border-blue-200"
            }`}
        >
          <p
            className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-700"
              }`}
          >
            <span className="font-medium">
              {filteredDrivers.length} di {drivers.length} veicoli
            </span>
            {" "}corrispondono ai filtri attivi. I grafici mostrano solo i dati filtrati.
          </p>
        </div>
      )}

      {/* Overview Tab */}
      {activeReport === "overview" && (
        <OverviewStats isDarkMode={isDarkMode} fleetStats={fleetStats} />
      )}

      {/* Emissions Tab */}
      {activeReport === "emissions" && (
        <EmissionsChart
          isDarkMode={isDarkMode}
          chartData={chartData.emissionsChartData}
          colors={COLORS}
        />
      )}

      {/* Costs Tab */}
      {activeReport === "costs" && (
        <CostsChart
          isDarkMode={isDarkMode}
          chartData={chartData.feeChartData}
          colors={COLORS}
        />
      )}

      {/* Contracts Tab */}
      {activeReport === "contracts" && (
        <ContractsChart
          isDarkMode={isDarkMode}
          chartData={chartData.contractExpiryChartData}
          colors={COLORS}
        />
      )}

      {/* Distribution Tab */}
      {activeReport === "distribution" && (
        <DistributionCharts
          isDarkMode={isDarkMode}
          chartData={chartData}
          colors={COLORS}
          pieColors={PIE_COLORS}
        />
      )}
    </div>
  );
};

export default ReportsManager;
