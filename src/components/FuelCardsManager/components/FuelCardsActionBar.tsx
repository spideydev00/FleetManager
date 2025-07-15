import React from "react";
import { Plus, Upload, Trash2, FileText, Search, Loader2 } from "lucide-react";

interface FuelCardsActionBarProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFuelCardsCount: number;
  onAddFuelCard: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
  onDeleteSelected: () => void;
  isLoading: boolean;
  uploadingExcel: boolean;
}

const FuelCardsActionBar: React.FC<FuelCardsActionBarProps> = ({
  isDarkMode,
  searchTerm,
  setSearchTerm,
  selectedFuelCardsCount,
  onAddFuelCard,
  onImportExcel,
  onExportExcel,
  onDeleteSelected,
  isLoading,
  uploadingExcel,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2
            className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Gestione Fuel Cards
          </h2>
          <p
            className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Gestisci le carte carburante per i veicoli. Monitora richieste e
            consegne.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedFuelCardsCount > 0 && (
            <button
              onClick={onDeleteSelected}
              disabled={isLoading}
              className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Elimina ({selectedFuelCardsCount})</span>
            </button>
          )}
          <button
            onClick={onAddFuelCard}
            disabled={isLoading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 whitespace-normal text-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Nuova Card</span>
          </button>
          <button
            onClick={onImportExcel}
            disabled={uploadingExcel || isLoading}
            className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-normal text-center ${uploadingExcel || isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {uploadingExcel ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Caricamento...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 flex-shrink-0" />
                <span>Carica Excel</span>
              </>
            )}
          </button>
          <button
            onClick={onExportExcel}
            disabled={isLoading}
            className={`bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center space-x-2 whitespace-normal text-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>Esporta Excel</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative w-full md:w-64 lg:w-80">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
          />
          <input
            type="text"
            placeholder="Cerca targa, driver, società..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FuelCardsActionBar;
