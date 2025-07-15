import React from "react";
import { Search, Trash2, X } from "lucide-react";
import { Driver, FuelCard } from "../../../entities/types";

interface FuelCardFormProps {
  isDarkMode: boolean;
  isVisible: boolean;
  drivers: Driver[];
  newFuelCard: Partial<FuelCard>;
  setNewFuelCard: (fuelCard: Partial<FuelCard>) => void;
  selectedDriverData: Driver | null;
  driverSearchTerm: string;
  setDriverSearchTerm: (term: string) => void;
  onDriverSelection: (driver: Driver) => void;
  onClearDriverSelection: () => void;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  operationError: string;
}

const FuelCardForm: React.FC<FuelCardFormProps> = ({
  isDarkMode,
  isVisible,
  drivers,
  newFuelCard,
  setNewFuelCard,
  selectedDriverData,
  driverSearchTerm,
  setDriverSearchTerm,
  onDriverSelection,
  onClearDriverSelection,
  onClose,
  onSave,
  isLoading,
  operationError,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } p-6 rounded-lg shadow`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Aggiungi Nuova Fuel Card
        </h3>
        <button
          onClick={onClose}
          className={`${isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Driver Selection Section */}
      <div className="mb-4">
        <label
          className={`block mb-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          Driver*
        </label>
        <div className="space-y-2">
          {selectedDriverData ? (
            <div
              className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-gray-50 border border-gray-200"
                }`}
            >
              <div>
                <div
                  className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                >
                  {selectedDriverData.nomeDriver}
                </div>
                <div
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {selectedDriverData.marca} {selectedDriverData.modello} -{" "}
                  {selectedDriverData.targa}
                </div>
              </div>
              <button
                type="button"
                onClick={onClearDriverSelection}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                title="Rimuovi driver"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                />
                <input
                  type="text"
                  placeholder="Cerca driver per nome..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
                    }`}
                  value={driverSearchTerm}
                  onChange={(e) => setDriverSearchTerm(e.target.value)}
                />
              </div>

              {driverSearchTerm && (
                <div
                  className={`max-h-60 overflow-y-auto rounded-lg border ${isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                    }`}
                >
                  {drivers
                    .filter((driver) =>
                      driver.nomeDriver
                        .toLowerCase()
                        .includes(driverSearchTerm.toLowerCase())
                    )
                    .map((driver) => (
                      <div
                        key={driver.id}
                        className={`p-2 cursor-pointer hover:${isDarkMode ? "bg-gray-600" : "bg-gray-100"
                          } ${isDarkMode
                            ? "border-b border-gray-600"
                            : "border-b border-gray-200"
                          } last:border-b-0`}
                        onClick={() => onDriverSelection(driver)}
                      >
                        <div
                          className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {driver.nomeDriver}
                        </div>
                        <div
                          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          {driver.marca} {driver.modello} -{" "}
                          {driver.targa || "Senza targa"}
                        </div>
                        <div
                          className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                          {driver.societa} -{" "}
                          {driver.alimentazione ||
                            "Alimentazione non specificata"}
                        </div>
                      </div>
                    ))}

                  {drivers.filter((driver) =>
                    driver.nomeDriver
                      .toLowerCase()
                      .includes(driverSearchTerm.toLowerCase())
                  ).length === 0 && (
                      <div
                        className={`p-3 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Nessun driver trovato
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Read-only fields auto-populated from driver */}
        <div>
          <label className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Targa (Auto-compilato)
          </label>
          <input
            type="text"
            className={`px-3 py-2 border rounded-lg ${isDarkMode
              ? "bg-gray-600 border-gray-500 text-gray-300"
              : "bg-gray-100 border-gray-300 text-gray-600"
              } cursor-not-allowed`}
            value={newFuelCard.targa || ""}
            readOnly
            placeholder="Seleziona un driver"
          />
        </div>

        <div>
          <label className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Nome Driver (Auto-compilato)
          </label>
          <input
            type="text"
            className={`px-3 py-2 border rounded-lg ${isDarkMode
              ? "bg-gray-600 border-gray-500 text-gray-300"
              : "bg-gray-100 border-gray-300 text-gray-600"
              } cursor-not-allowed`}
            value={newFuelCard.nome_driver || ""}
            readOnly
            placeholder="Seleziona un driver"
          />
        </div>

        <div>
          <label className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Società (Auto-compilato)
          </label>
          <input
            type="text"
            className={`px-3 py-2 border rounded-lg ${isDarkMode
              ? "bg-gray-600 border-gray-500 text-gray-300"
              : "bg-gray-100 border-gray-300 text-gray-600"
              } cursor-not-allowed`}
            value={newFuelCard.societa || ""}
            readOnly
            placeholder="Seleziona un driver"
          />
        </div>

        <div>
          <label className={`block mb-1 text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Alimentazione (Auto-compilato)
          </label>
          <input
            type="text"
            className={`px-3 py-2 border rounded-lg ${isDarkMode
              ? "bg-gray-600 border-gray-500 text-gray-300"
              : "bg-gray-100 border-gray-300 text-gray-600"
              } cursor-not-allowed`}
            value={newFuelCard.alimentazione || ""}
            readOnly
            placeholder="Seleziona un driver"
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
          value={newFuelCard.dataRichiesta || ""}
          onChange={(e) =>
            setNewFuelCard({ ...newFuelCard, dataRichiesta: e.target.value })
          }
        />

        <select
          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
            ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:border-transparent"
            }`}
          value={newFuelCard.stato || "Non arrivata"}
          onChange={(e) =>
            setNewFuelCard({
              ...newFuelCard,
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
          placeholder="personale"
          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
            }`}
          value={newFuelCard.personale || ""}
          onChange={(e) =>
            setNewFuelCard({ ...newFuelCard, personale: e.target.value })
          }
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={onSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Caricamento..." : "Salva Fuel Card"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Annulla
        </button>
      </div>

      {operationError && (
        <div className="mt-4 text-red-500 text-sm">{operationError}</div>
      )}
    </div>
  );
};

export default FuelCardForm;
