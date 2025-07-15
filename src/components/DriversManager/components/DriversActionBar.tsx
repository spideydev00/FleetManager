import React from "react";
import { Search, Plus, Upload, Download, Trash2, Loader2 } from "lucide-react";

interface DriversActionBarProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDriversCount: number;
  onAddDriver: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
  onDeleteSelected: () => void;
  isLoading: boolean;
}

const DriversActionBar: React.FC<DriversActionBarProps> = ({
  isDarkMode,
  searchTerm,
  setSearchTerm,
  selectedDriversCount,
  onAddDriver,
  onImportExcel,
  onExportExcel,
  onDeleteSelected,
  isLoading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cerca per nome, targa, società..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onAddDriver}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition-colors disabled:opacity-50`}
        >
          <Plus className="w-4 h-4" />
          Aggiungi Driver
        </button>

        <button
          onClick={onImportExcel}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDarkMode
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors disabled:opacity-50`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Importa Excel
        </button>

        <button
          onClick={onExportExcel}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDarkMode
              ? "bg-purple-500 hover:bg-purple-600 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          } transition-colors disabled:opacity-50`}
        >
          <Download className="w-4 h-4" />
          Esporta Excel
        </button>

        {selectedDriversCount > 0 && (
          <button
            onClick={onDeleteSelected}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            } transition-colors disabled:opacity-50`}
          >
            <Trash2 className="w-4 h-4" />
            Elimina Selezionati ({selectedDriversCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default DriversActionBar;
