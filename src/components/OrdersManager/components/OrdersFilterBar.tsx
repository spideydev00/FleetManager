import React from "react";
import { Search, Filter } from "lucide-react";

interface OrdersFilterBarProps {
  isDarkMode: boolean;
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredOrdersCount: number;
  totalOrdersCount: number;
  filteredOrdersToMakeCount: number;
  totalOrdersToMakeCount: number;
}

const OrdersFilterBar: React.FC<OrdersFilterBarProps> = ({
  isDarkMode,
  activeTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredOrdersCount,
  totalOrdersCount,
  filteredOrdersToMakeCount,
  totalOrdersToMakeCount,
}) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
      } p-4 rounded-lg shadow`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder={
              activeTab === "inCorso"
                ? "Cerca ordine, nome, marca..."
                : "Cerca driver..."
            }
            className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "inCorso" && (
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
            <option value="Consegnata">Consegnata</option>
            <option value="Non consegnata">Non consegnata</option>
          </select>
        )}
        <div
          className={`text-sm flex items-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <Filter className="w-4 h-4 mr-1" />
          <span>
            {activeTab === "inCorso"
              ? `${filteredOrdersCount} di ${totalOrdersCount} ordini`
              : `${filteredOrdersToMakeCount} di ${totalOrdersToMakeCount} ordini da fare`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilterBar;
