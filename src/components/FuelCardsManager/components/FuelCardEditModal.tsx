import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import { FuelCard } from "../../../types";

interface FuelCardEditModalProps {
  isVisible: boolean;
  isDarkMode: boolean;
  editingFuelCard: FuelCard;
  setEditingFuelCard: (fuelCard: FuelCard) => void;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  operationError: string;
}

const FuelCardEditModal: React.FC<FuelCardEditModalProps> = ({
  isVisible,
  isDarkMode,
  editingFuelCard,
  setEditingFuelCard,
  onClose,
  onSave,
  isLoading,
  operationError,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          } rounded-lg p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Modifica Fuel Card
          </h3>
          <button
            onClick={onClose}
            className={`${isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Read-only fields from driver data */}
          <div>
            <label
              className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Targa (Da driver)
            </label>
            <input
              type="text"
              className={`px-3 py-2 border rounded-lg ${isDarkMode
                  ? "bg-gray-600 border-gray-500 text-gray-300"
                  : "bg-gray-100 border-gray-300 text-gray-600"
                } cursor-not-allowed`}
              value={editingFuelCard.targa}
              readOnly
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Nome Driver (Da driver)
            </label>
            <input
              type="text"
              className={`px-3 py-2 border rounded-lg ${isDarkMode
                  ? "bg-gray-600 border-gray-500 text-gray-300"
                  : "bg-gray-100 border-gray-300 text-gray-600"
                } cursor-not-allowed`}
              value={editingFuelCard.nome_driver}
              readOnly
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Società (Da driver)
            </label>
            <input
              type="text"
              className={`px-3 py-2 border rounded-lg ${isDarkMode
                  ? "bg-gray-600 border-gray-500 text-gray-300"
                  : "bg-gray-100 border-gray-300 text-gray-600"
                } cursor-not-allowed`}
              value={editingFuelCard.societa}
              readOnly
            />
          </div>

          <div>
            <label
              className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Alimentazione (Da driver)
            </label>
            <input
              type="text"
              className={`px-3 py-2 border rounded-lg ${isDarkMode
                  ? "bg-gray-600 border-gray-500 text-gray-300"
                  : "bg-gray-100 border-gray-300 text-gray-600"
                } cursor-not-allowed`}
              value={editingFuelCard.alimentazione}
              readOnly
            />
          </div>

          {/* Editable fields */}
          <input
            type="date"
            placeholder="Data Richiesta"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500 dark-calendar"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={editingFuelCard.dataRichiesta}
            onChange={(e) =>
              setEditingFuelCard({
                ...editingFuelCard,
                dataRichiesta: e.target.value,
              })
            }
          />

          <select
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-transparent"
              }`}
            value={editingFuelCard.stato || "Non arrivata"}
            onChange={(e) =>
              setEditingFuelCard({
                ...editingFuelCard,
                stato: e.target.value as
                  | "Non arrivata"
                  | "Arrivata"
                  | "In attesa",
              })
            }
          >
            <option value="Non arrivata">Non arrivata</option>
            <option value="Arrivata">Arrivata</option>
            <option value="In attesa">In attesa</option>
          </select>

          <input
            type="text"
            placeholder="Referente"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={editingFuelCard.referente}
            onChange={(e) =>
              setEditingFuelCard({
                ...editingFuelCard,
                referente: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            Annulla
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Aggiornamento...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Aggiorna Fuel Card</span>
              </>
            )}
          </button>
        </div>

        {operationError && (
          <div className="mt-4 text-red-500 text-sm">{operationError}</div>
        )}
      </div>
    </div>
  );
};

export default FuelCardEditModal;
