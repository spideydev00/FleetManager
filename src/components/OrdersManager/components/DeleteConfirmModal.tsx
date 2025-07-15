import React from "react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isVisible: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  deleteType: string;
  itemToDelete: string | null;
  selectedOrdersCount: number;
  selectedOrdersToMakeCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isVisible,
  isDarkMode,
  isLoading,
  deleteType,
  itemToDelete,
  selectedOrdersCount,
  selectedOrdersToMakeCount,
  onConfirm,
  onCancel,
}) => {
  if (!isVisible) return null;

  const getMessage = () => {
    switch (deleteType) {
      case "order":
      case "orderToMake":
        return "Sei sicuro di voler eliminare questo ordine?";
      case "orders":
        return `Sei sicuro di voler eliminare ${selectedOrdersCount} ordini selezionati?`;
      case "ordersToMake":
        return `Sei sicuro di voler eliminare ${selectedOrdersToMakeCount} ordini da fare selezionati?`;
      default:
        return "Sei sicuro di voler eliminare questo elemento?";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } rounded-lg p-6 m-4 max-w-sm w-full`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Conferma eliminazione
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {getMessage()}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              "Elimina"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
