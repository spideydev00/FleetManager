import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isVisible: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  driverToDelete: string | null;
  selectedDriversCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isVisible,
  isDarkMode,
  isLoading,
  driverToDelete,
  selectedDriversCount,
  onConfirm,
  onCancel,
}) => {
  if (!isVisible) return null;

  const isMultipleDelete = !driverToDelete && selectedDriversCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-xl max-w-md w-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Conferma Eliminazione
            </h2>
          </div>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {isMultipleDelete
                ? `Sei sicuro di voler eliminare ${selectedDriversCount} driver selezionati?`
                : "Sei sicuro di voler eliminare questo driver?"}
            </p>
            <p className={`text-sm mt-2 font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
              Questa azione non può essere annullata.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDarkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              } transition-colors disabled:opacity-50 flex-1`}
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? "Eliminazione..." : "Elimina"}
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              } transition-colors flex-1`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
