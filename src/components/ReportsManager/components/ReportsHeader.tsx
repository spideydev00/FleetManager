import React from "react";
import { Filter, FileText } from "lucide-react";

interface ReportsHeaderProps {
  isDarkMode: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onExportExcel: () => void;
  hasActiveFilters?: boolean;
  filteredCount?: number;
  totalCount?: number;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  isDarkMode,
  showFilters,
  setShowFilters,
  onExportExcel,
  hasActiveFilters = false,
  filteredCount = 0,
  totalCount = 0,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Report e Analisi
        </h2>
        <p
          className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
        >
          Visualizza statistiche e analisi della tua flotta. Esporta dati per
          reporting avanzato.
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isDarkMode
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          <Filter className="w-4 h-4" />
          <span>Esegui A.D</span>
        </button>
        <button
          onClick={onExportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          title={
            hasActiveFilters
              ? `Esporta ${filteredCount} veicoli filtrati`
              : `Esporta tutti i ${totalCount} veicoli`
          }
        >
          <FileText className="w-4 h-4" />
          <span>
            {hasActiveFilters
              ? `Esporta Filtrati (${filteredCount})`
              : "Esporta Excel"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;
