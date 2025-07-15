import React from "react";
import { Filter } from "lucide-react";

interface FuelCardsFilterBarProps {
  isDarkMode: boolean;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredCount: number;
  totalCount: number;
}

const FuelCardsFilterBar: React.FC<FuelCardsFilterBarProps> = ({
  isDarkMode,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount,
}) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
      } p-4 rounded-lg shadow`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 focus:border-transparent"
          }`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tutti gli stati</option>
          <option value="Arrivata">Arrivata</option>
          <option value="Non arrivata">Non arrivata</option>
          <option value="In attesa">In attesa</option>
        </select>

        <div
          className={`text-sm flex items-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <Filter className="w-4 h-4 mr-1" />
          <span>
            {filteredCount} di {totalCount} fuel cards
          </span>
        </div>
      </div>
    </div>
  );
};

export default FuelCardsFilterBar;
