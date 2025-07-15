import React from "react";
import { Plus, Upload, Trash2, Loader2 } from "lucide-react";

interface OrdersActionBarProps {
  isDarkMode: boolean;
  activeTab: string;
  selectedOrdersCount: number;
  selectedOrdersToMakeCount: number;
  onAddOrder: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
  onDeleteSelectedOrders: () => void;
  onDeleteSelectedOrdersToMake: () => void;
  isLoading: boolean;
  uploadingExcel: boolean;
}

const OrdersActionBar: React.FC<OrdersActionBarProps> = ({
  isDarkMode,
  activeTab,
  selectedOrdersCount,
  selectedOrdersToMakeCount,
  onAddOrder,
  onImportExcel,
  onExportExcel,
  onDeleteSelectedOrders,
  onDeleteSelectedOrdersToMake,
  isLoading,
  uploadingExcel,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {activeTab === "daFare" ? "Ordini da Fare" : "Ordini in Corso"}
        </h2>
        <p
          className={`text-sm mt-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {activeTab === "daFare"
            ? "Gestisci il workflow di approvazione ordini: dalla scelta auto alle firme finali"
            : "Monitora ordini emessi e traccia le consegne"}
        </p>
      </div>
      <div className="flex space-x-2">
        {activeTab === "inCorso" && selectedOrdersCount > 0 && (
          <button
            onClick={onDeleteSelectedOrders}
            disabled={isLoading}
            className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Elimina ({selectedOrdersCount})</span>
          </button>
        )}
        {activeTab === "daFare" && selectedOrdersToMakeCount > 0 && (
          <button
            onClick={onDeleteSelectedOrdersToMake}
            disabled={isLoading}
            className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Elimina ({selectedOrdersToMakeCount})</span>
          </button>
        )}
        <button
          onClick={onAddOrder}
          disabled={isLoading}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuovo Ordine</span>
        </button>
        {activeTab === "inCorso" && (
          <div className="flex space-x-2">
            <button
              onClick={onImportExcel}
              disabled={uploadingExcel || isLoading}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 ${
                uploadingExcel || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {uploadingExcel ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Caricamento...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Carica Excel</span>
                </>
              )}
            </button>
            <button
              onClick={onExportExcel}
              disabled={isLoading}
              className={`bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center space-x-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 3v12"></path>
                <path d="m8 11 4 4 4-4"></path>
                <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
              </svg>
              <span>Esporta Excel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersActionBar;
