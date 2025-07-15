import React, { useState, useMemo, useRef } from "react";
import { Eye, Settings, Download, Loader2 } from "lucide-react";
import { Driver } from "../../../types";
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
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
    }
  );

  const visibleColumnsCount = useMemo(
    () => Object.values(visibleColumns).filter(Boolean).length,
    [visibleColumns]
  );

  const [isColumnConfigOpen, setIsColumnConfigOpen] = useState(false);
  const MAX_VISIBLE_COLUMNS = 7;
  const [sortField, setSortField] =
    useState<keyof typeof visibleColumns>("driver");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
        drivers
      );
      if (error) {
        console.error("Export error:", error);
        alert(
          `Errore durante l'esportazione: ${(error as any).message || "Errore sconosciuto"
          }`
        );
      }
    } catch (error: any) {
      console.error("Export error:", error);
      alert(
        `Errore durante l'esportazione: ${error.message || "Errore sconosciuto"
        }`
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const calculateTableHeight = () => {
    const rowHeight = 58;
    const headerHeight = 80;
    const contentHeight =
      Math.min(drivers.length, 10) * rowHeight + headerHeight;
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
          </h3>
          <div className="flex items-center space-x-3">
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
          {drivers.length > 10
            ? `Dashboard - Vista limitata a 10 driver. Usa la sezione Driver per la gestione completa.`
            : `${drivers.length} driver ${drivers.length > 1
              ? "disponibili nella flotta"
              : "disponibile nella flotta"
            }`}
        </span>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto overflow-y-auto w-full"
        style={{
          maxHeight: calculateTableHeight(),
          height: calculateTableHeight(),
          position: "relative",
        }}
      >
        <table
          className="table-fleet w-full table-fixed"
          cellPadding={0}
          cellSpacing={0}
        >
          <thead>
            <tr
              className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"
                } sticky top-0 z-10`}
            >
              {Object.entries(allColumns)
                .filter(([columnId]) => visibleColumns[columnId])
                .map(([columnId, column]) => (
                  <th
                    key={columnId}
                    className={`px-3 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"
                      } uppercase tracking-wider`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className={isDarkMode ? "bg-gray-800" : "bg-white"}>
            {drivers.map((driver, index) => (
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
            Mostrando {drivers.length} di {drivers.length} driver
          </span>
        </div>
      </div>
    </div>
  );
};

export default DriversTable;
