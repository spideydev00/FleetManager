import React, { useState, useMemo, useRef } from "react";
import { Eye, Settings, Download, Loader2, Search, Filter, X } from "lucide-react";
import { Driver } from "../../../entities/types";
import { dashboardService } from "../services/dashboardService";

interface DriversTableProps {
  drivers: Driver[];
  isDarkMode: boolean;
  compact?: boolean;
  height?: string;
  isLoading?: boolean;
}

interface ColumnFilter {
  value: string;
  isActive: boolean;
  options?: string[];
  years?: number[];
}

type FilterState = {
  [key: string]: ColumnFilter;
};

interface Column {
  id: string;
  label: string;
  width: string;
  mandatory: boolean;
}

type ColumnsConfig = {
  [key: string]: Column;
};

const allColumns: ColumnsConfig = {
  driver: { id: "driver", label: "DRIVER", width: "180px", mandatory: true },
  veicolo: { id: "veicolo", label: "VEICOLO", width: "220px", mandatory: true },
  societa: {
    id: "societa",
    label: "Società",
    width: "150px",
    mandatory: false,
  },
  centroCosto: {
    id: "centroCosto",
    label: "C.costo",
    width: "120px",
    mandatory: false,
  },
  noleggiatore: {
    id: "noleggiatore",
    label: "Noleggiatore",
    width: "180px",
    mandatory: false,
  },
  alimentazione: {
    id: "alimentazione",
    label: "Alimentazione",
    width: "140px",
    mandatory: false,
  },
  kmContrattuali: {
    id: "kmContrattuali",
    label: "Km",
    width: "100px",
    mandatory: false,
  },
  canoneMensile: {
    id: "canoneMensile",
    label: "Canone",
    width: "140px",
    mandatory: false,
  },
  inizioContratto: {
    id: "inizioContratto",
    label: "Inizio",
    width: "140px",
    mandatory: false,
  },
  scadenzaContratto: {
    id: "scadenzaContratto",
    label: "Scadenza",
    width: "140px",
    mandatory: false,
  },
};

const DriversTable: React.FC<DriversTableProps> = ({
  drivers,
  isDarkMode,
  height = "400px",
  isLoading = false,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    driver: true,
    veicolo: true,
    societa: true,
    centroCosto: false,
    noleggiatore: true,
    alimentazione: false,
    kmContrattuali: true,
    canoneMensile: true,
    inizioContratto: false,
    scadenzaContratto: true,
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    driver: { value: "", isActive: false },
    veicolo: { value: "", isActive: false },
    societa: { value: "", isActive: false },
    centroCosto: { value: "", isActive: false },
    noleggiatore: { value: "", isActive: false },
    alimentazione: { value: "", isActive: false },
    kmContrattuali: { value: "", isActive: false },
    canoneMensile: { value: "", isActive: false },
    inizioContratto: { value: "", isActive: false },
    scadenzaContratto: { value: "", isActive: false },
  });

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const visibleColumnsCount = useMemo(
    () => Object.values(visibleColumns).filter(Boolean).length,
    [visibleColumns]
  );

  const [isColumnConfigOpen, setIsColumnConfigOpen] = useState(false);
  const MAX_VISIBLE_COLUMNS = 7;

  // Generate filter options for each column
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    const years: Record<string, number[]> = {};

    Object.keys(allColumns).forEach(columnId => {
      const uniqueValues = new Set<string>();
      const uniqueYears = new Set<number>();

      drivers.forEach(driver => {
        let value: any;
        switch (columnId) {
          case "driver":
            value = driver.nomeDriver;
            break;
          case "veicolo":
            value = `${driver.marca} ${driver.modello}`;
            break;
          case "societa":
            value = driver.societa;
            break;
          case "centroCosto":
            value = driver.centroCosto;
            break;
          case "noleggiatore":
            value = driver.noleggiatore;
            break;
          case "alimentazione":
            value = driver.alimentazione;
            break;
          case "inizioContratto":
            if (driver.inizioContratto) {
              const year = new Date(driver.inizioContratto).getFullYear();
              if (!isNaN(year)) uniqueYears.add(year);
            }
            break;
          case "scadenzaContratto":
            if (driver.scadenzaContratto) {
              const year = new Date(driver.scadenzaContratto).getFullYear();
              if (!isNaN(year)) uniqueYears.add(year);
            }
            break;
        }

        if (value && typeof value === 'string' && value.trim()) {
          uniqueValues.add(value.trim());
        }
      });

      options[columnId] = Array.from(uniqueValues).sort();
      years[columnId] = Array.from(uniqueYears).sort();
    });

    return { options, years };
  }, [drivers]);

  // Filter drivers based on active filters
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      return Object.entries(filters).every(([columnId, filter]) => {
        if (!filter.isActive || !filter.value) return true;

        let driverValue: string = "";
        let filterValue = filter.value.toLowerCase();

        switch (columnId) {
          case "driver":
            driverValue = driver.nomeDriver.toLowerCase();
            break;
          case "veicolo":
            driverValue = `${driver.marca} ${driver.modello}`.toLowerCase();
            break;
          case "societa":
            driverValue = (driver.societa || "").toLowerCase();
            break;
          case "centroCosto":
            driverValue = (driver.centroCosto || "").toLowerCase();
            break;
          case "noleggiatore":
            driverValue = (driver.noleggiatore || "").toLowerCase();
            break;
          case "alimentazione":
            driverValue = (driver.alimentazione || "").toLowerCase();
            break;
          case "kmContrattuali":
            driverValue = (driver.kmContrattuali?.toString() || "").toLowerCase();
            break;
          case "canoneMensile":
            driverValue = (driver.canoneMensile?.toString() || "").toLowerCase();
            break;
          case "inizioContratto":
            if (filter.value.startsWith("year:")) {
              const year = parseInt(filter.value.replace("year:", ""));
              if (driver.inizioContratto) {
                const driverYear = new Date(driver.inizioContratto).getFullYear();
                return driverYear === year;
              }
              return false;
            }
            driverValue = driver.inizioContratto ? new Date(driver.inizioContratto).toLocaleDateString("it-IT").toLowerCase() : "";
            break;
          case "scadenzaContratto":
            if (filter.value.startsWith("year:")) {
              const year = parseInt(filter.value.replace("year:", ""));
              if (driver.scadenzaContratto) {
                const driverYear = new Date(driver.scadenzaContratto).getFullYear();
                return driverYear === year;
              }
              return false;
            }
            if (filter.value === "next3months") {
              if (driver.scadenzaContratto) {
                const today = new Date();
                const threeMonthsFromNow = new Date();
                threeMonthsFromNow.setMonth(today.getMonth() + 3);
                const scadenza = new Date(driver.scadenzaContratto);
                return scadenza >= today && scadenza <= threeMonthsFromNow;
              }
              return false;
            }
            if (filter.value === "next6months") {
              if (driver.scadenzaContratto) {
                const today = new Date();
                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(today.getMonth() + 6);
                const scadenza = new Date(driver.scadenzaContratto);
                return scadenza >= today && scadenza <= sixMonthsFromNow;
              }
              return false;
            }
            driverValue = driver.scadenzaContratto ? new Date(driver.scadenzaContratto).toLocaleDateString("it-IT").toLowerCase() : "";
            break;
        }

        return driverValue.includes(filterValue);
      });
    });
  }, [drivers, filters]);

  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(0);
    }
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const exportToExcel = async () => {
    setLocalLoading(true);
    try {
      const { success, error } = await dashboardService.exportDashboardData(
        filteredDrivers
      );
      if (error) {
        console.error("Export error:", error);
        alert(
          `Errore durante l'esportazione: ${(error as any).message || "Errore sconosciuto"}`
        );
      }
    } catch (error: any) {
      console.error("Export error:", error);
      alert(
        `Errore durante l'esportazione: ${error.message || "Errore sconosciuto"}`
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const calculateTableHeight = () => {
    const rowHeight = 58;
    const headerHeight = 80;
    const filterRowHeight = showColumnFilters ? 40 : 0;
    const contentHeight =
      Math.min(filteredDrivers.length, 10) * rowHeight + headerHeight + filterRowHeight;
    return `${Math.min(parseInt(height), contentHeight)}px`;
  };

  const handleColumnToggle = (columnId: string) => {
    if (allColumns[columnId].mandatory) return;

    const newVisibleColumns = { ...visibleColumns };
    const isCurrentlyVisible = newVisibleColumns[columnId];

    if (isCurrentlyVisible) {
      newVisibleColumns[columnId] = false;
    } else {
      const currentVisibleCount =
        Object.values(newVisibleColumns).filter(Boolean).length;
      if (currentVisibleCount < MAX_VISIBLE_COLUMNS) {
        newVisibleColumns[columnId] = true;
      }
    }

    setVisibleColumns(newVisibleColumns);
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        value,
        isActive: value.length > 0
      }
    }));
  };

  const clearFilter = (columnId: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        value: "",
        isActive: false
      }
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {};
    Object.keys(filters).forEach(key => {
      clearedFilters[key] = { value: "", isActive: false };
    });
    setFilters(clearedFilters);
  };

  const getDropdownPosition = (columnIndex: number, totalColumns: number) => {
    if (columnIndex === 0) return "left-0";
    if (columnIndex === totalColumns - 1) return "right-0";
    return "left-1/2 transform -translate-x-1/2";
  };

  const renderFilterDropdown = (columnId: string, columnIndex: number, totalColumns: number) => {
    if (activeFilterDropdown !== columnId) return null;

    const positionClass = getDropdownPosition(columnIndex, totalColumns);

    return (
      <div className={`absolute top-full mt-1 ${positionClass} z-50 min-w-[200px]`}>
        <div className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} rounded-lg shadow-lg p-3`}>
          {/* Search input for text columns */}
          {!["inizioContratto", "scadenzaContratto"].includes(columnId) && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Cerca..."
                className={`w-full px-2 py-1 text-sm border rounded ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
                value={filters[columnId]?.value || ""}
                onChange={(e) => handleFilterChange(columnId, e.target.value)}
              />
            </div>
          )}

          {/* Date filters */}
          {columnId === "inizioContratto" && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtra per anno:</div>
              {filterOptions.years[columnId]?.map(year => (
                <button
                  key={year}
                  onClick={() => handleFilterChange(columnId, `year:${year}`)}
                  className={`block w-full text-left px-2 py-1 text-sm rounded ${filters[columnId]?.value === `year:${year}` ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {columnId === "scadenzaContratto" && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtri rapidi:</div>
              <button
                onClick={() => handleFilterChange(columnId, "next3months")}
                className={`block w-full text-left px-2 py-1 text-sm rounded ${filters[columnId]?.value === "next3months" ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                Prossimi 3 mesi
              </button>
              <button
                onClick={() => handleFilterChange(columnId, "next6months")}
                className={`block w-full text-left px-2 py-1 text-sm rounded ${filters[columnId]?.value === "next6months" ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                Prossimi 6 mesi
              </button>
              <hr className={`my-2 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`} />
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtra per anno:</div>
              {filterOptions.years[columnId]?.map(year => (
                <button
                  key={year}
                  onClick={() => handleFilterChange(columnId, `year:${year}`)}
                  className={`block w-full text-left px-2 py-1 text-sm rounded ${filters[columnId]?.value === `year:${year}` ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Options for other text columns */}
          {!["inizioContratto", "scadenzaContratto", "kmContrattuali", "canoneMensile"].includes(columnId) && filterOptions.options[columnId]?.length > 0 && (
            <div className="max-h-40 overflow-y-auto">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Valori disponibili:</div>
              {filterOptions.options[columnId]
                .filter(option => option.toLowerCase().includes((filters[columnId]?.value || "").toLowerCase()))
                .map(option => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange(columnId, option)}
                    className={`block w-full text-left px-2 py-1 text-sm rounded truncate ${filters[columnId]?.value === option ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    title={option}
                  >
                    {option}
                  </button>
                ))}
            </div>
          )}

          {/* Clear filter button */}
          {filters[columnId]?.isActive && (
            <button
              onClick={() => clearFilter(columnId)}
              className="w-full mt-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Rimuovi filtro
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-700" : "bg-white"
          } overflow-hidden`}
      >
        <div
          className={`px-5 py-4 border-b ${isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-gray-50"
            }`}
        >
          <div className="flex justify-between items-center">
            <h3
              className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
            >
              Tutti i Driver
            </h3>
            <div className="flex items-center">
              <Loader2
                className={`w-5 h-5 mr-2 animate-spin ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              />
            </div>
          </div>
        </div>
        <div className="p-8 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-700 h-10 w-10 mb-2"></div>
            <div className="h-2 bg-slate-700 rounded w-48 mb-4"></div>
            <div className="h-2 bg-slate-700 rounded w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  const visibleColumnIds = Object.entries(allColumns)
    .filter(([columnId]) => visibleColumns[columnId])
    .map(([columnId]) => columnId);

  const activeFiltersCount = Object.values(filters).filter(f => f.isActive).length;

  return (
    <div
      className={`rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-700" : "bg-white"
        } overflow-hidden w-full`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b ${isDarkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-gray-50"
          }`}
      >
        <div className="flex justify-between items-center">
          <h3
            className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
          >
            Tutti i Driver
            {activeFiltersCount > 0 && (
              <span className={`ml-2 text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                ({filteredDrivers.length} di {drivers.length})
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowColumnFilters(!showColumnFilters)}
              className={`p-2 rounded-lg transition-colors ${showColumnFilters || activeFiltersCount > 0
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
              title="Filtri colonne"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="ml-1 text-xs">{activeFiltersCount}</span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="p-2 rounded-lg transition-colors bg-red-500 hover:bg-red-600 text-white"
                title="Rimuovi tutti i filtri"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsColumnConfigOpen(!isColumnConfigOpen)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
              title="Configura colonne"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={exportToExcel}
              disabled={localLoading}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
                } ${localLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Esporta Excel"
            >
              {localLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Column Configuration Panel */}
      {isColumnConfigOpen && (
        <div
          className={`px-5 py-3 border-b ${isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-gray-50"
            }`}
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(allColumns).map(([columnId, column]) => (
              <button
                key={columnId}
                onClick={() => handleColumnToggle(columnId)}
                disabled={column.mandatory}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${visibleColumns[columnId]
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  } ${column.mandatory ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {column.label}
                {column.mandatory && " (Obbligatorio)"}
              </button>
            ))}
          </div>
          <p
            className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Colonne visibili: {visibleColumnsCount}/{MAX_VISIBLE_COLUMNS}
          </p>
        </div>
      )}

      {/* Sticky Notice */}
      <div
        className={`sticky top-0 px-4 py-2.5 text-center border-b ${isDarkMode
          ? "bg-blue-900 border-blue-800"
          : "bg-blue-50 border-blue-200"
          } z-20`}
      >
        <span
          className={`text-xs font-medium ${isDarkMode ? "text-blue-200" : "text-blue-700"
            }`}
        >
          Clicca le icone sovrastanti per filtrare i dati oppure per scegliere le colonne da visualizzare.
        </span>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto overflow-y-auto w-full relative"
        style={{
          maxHeight: calculateTableHeight(),
          height: calculateTableHeight(),
        }}
        onClick={() => setActiveFilterDropdown(null)}
      >
        <table
          className="table-fleet w-full table-fixed"
          cellPadding={0}
          cellSpacing={0}
        >
          <thead>
            {/* Header Row */}
            <tr
              className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"
                } sticky top-0 z-10`}
            >
              {visibleColumnIds.map((columnId, index) => {
                const column = allColumns[columnId];
                return (
                  <th
                    key={columnId}
                    className={`px-3 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"
                      } uppercase tracking-wider relative`}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {showColumnFilters && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFilterDropdown(
                              activeFilterDropdown === columnId ? null : columnId
                            );
                          }}
                          className={`ml-1 p-1 rounded ${filters[columnId]?.isActive
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-200 text-gray-500"
                            }`}
                        >
                          <Search className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {renderFilterDropdown(columnId, index, visibleColumnIds.length)}
                  </th>
                );
              })}
            </tr>

            {/* Filter Row */}
            {showColumnFilters && (
              <tr className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"} sticky top-12 z-10`}>
                {visibleColumnIds.map((columnId) => (
                  <th key={`filter-${columnId}`} className="px-3 py-2">
                    {!["inizioContratto", "scadenzaContratto"].includes(columnId) ? (
                      <input
                        type="text"
                        placeholder="Filtra..."
                        className={`w-full px-2 py-1 text-xs border rounded ${isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        value={filters[columnId]?.value || ""}
                        onChange={(e) => handleFilterChange(columnId, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Per Filtrare Clicca La Lente
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody className={isDarkMode ? "bg-gray-800" : "bg-white"}>
            {filteredDrivers.slice(0, 10).map((driver, index) => (
              <tr
                key={driver.id}
                className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
                  } hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } transition-colors`}
              >
                {visibleColumns.driver && (
                  <td className="px-3 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div
                          className={`h-8 w-8 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-gray-200"
                            } flex items-center justify-center`}
                        >
                          <span
                            className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                          >
                            {driver.nomeDriver.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                        >
                          {driver.nomeDriver}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.veicolo && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.marca} {driver.modello}
                    </div>
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      {driver.targa} - {driver.emissioni}
                    </div>
                  </td>
                )}
                {visibleColumns.societa && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.societa}
                    </div>
                  </td>
                )}
                {visibleColumns.centroCosto && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.centroCosto}
                    </div>
                  </td>
                )}
                {visibleColumns.noleggiatore && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.noleggiatore}
                    </div>
                  </td>
                )}
                {visibleColumns.alimentazione && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.alimentazione}
                    </div>
                  </td>
                )}
                {visibleColumns.kmContrattuali && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.kmContrattuali?.toLocaleString() || "0"}
                    </div>
                  </td>
                )}
                {visibleColumns.canoneMensile && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {formatCurrency(driver.canoneMensile)}
                    </div>
                  </td>
                )}
                {visibleColumns.inizioContratto && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.inizioContratto
                        ? new Date(driver.inizioContratto).toLocaleDateString(
                          "it-IT"
                        )
                        : "N/A"}
                    </div>
                  </td>
                )}
                {visibleColumns.scadenzaContratto && (
                  <td className="px-3 py-3">
                    <div
                      className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      {driver.scadenzaContratto
                        ? new Date(driver.scadenzaContratto).toLocaleDateString(
                          "it-IT"
                        )
                        : "N/A"}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className={`px-5 py-3 border-t ${isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
          }`}
      >
        <div
          className={`flex justify-between items-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          <span className="font-medium">
            Mostrando {Math.min(filteredDrivers.length, 10)} di {filteredDrivers.length} driver
            {activeFiltersCount > 0 && ` (${drivers.length} totali)`}
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-xs">
              {activeFiltersCount} filtro/i attivo/i
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriversTable;
