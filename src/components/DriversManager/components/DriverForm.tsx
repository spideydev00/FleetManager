import React from "react";
import { Driver } from "../../../entities/types";
import { X, Save, Plus } from "lucide-react";

interface DriverFormProps {
  isDarkMode: boolean;
  isVisible: boolean;
  newDriver: Partial<Driver>;
  setNewDriver: (driver: Partial<Driver>) => void;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({
  isDarkMode,
  isVisible,
  newDriver,
  setNewDriver,
  onClose,
  onSave,
  isLoading,
}) => {
  if (!isVisible) return null;

  const handleChange = (field: keyof Driver, value: any) => {
    setNewDriver({
      ...newDriver,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-500" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Aggiungi Nuovo Driver
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Informazioni Driver
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Nome Driver *
                  </label>
                  <input
                    type="text"
                    value={newDriver.nomeDriver || ""}
                    onChange={(e) => handleChange("nomeDriver", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Inserisci il nome del driver"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Centro di Costo
                  </label>
                  <input
                    type="text"
                    value={newDriver.centroCosto || ""}
                    onChange={(e) => handleChange("centroCosto", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Inserisci il centro di costo"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Informazioni Aziendali
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Società
                  </label>
                  <input
                    type="text"
                    value={newDriver.societa || ""}
                    onChange={(e) => handleChange("societa", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Inserisci la società"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Noleggiatore
                  </label>
                  <input
                    type="text"
                    value={newDriver.noleggiatore || ""}
                    onChange={(e) => handleChange("noleggiatore", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Inserisci il noleggiatore"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Informazioni Veicolo
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Targa *
                  </label>
                  <input
                    type="text"
                    value={newDriver.targa || ""}
                    onChange={(e) => handleChange("targa", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Inserisci la targa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={newDriver.marca || ""}
                      onChange={(e) => handleChange("marca", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Marca veicolo"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Modello *
                    </label>
                    <input
                      type="text"
                      value={newDriver.modello || ""}
                      onChange={(e) => handleChange("modello", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Modello veicolo"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Alimentazione *
                    </label>
                    <input
                      type="text"
                      value={newDriver.alimentazione || ""}
                      onChange={(e) => handleChange("alimentazione", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Tipo di alimentazione"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Emissioni
                    </label>
                    <input
                      type="text"
                      value={newDriver.emissioni || ""}
                      onChange={(e) => handleChange("emissioni", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Emissioni g/km"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Informazioni Contratto
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Inizio Contratto
                    </label>
                    <input
                      type="date"
                      value={newDriver.inizioContratto || ""}
                      onChange={(e) => handleChange("inizioContratto", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 dark-calendar"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Scadenza Contratto
                    </label>
                    <input
                      type="date"
                      value={newDriver.scadenzaContratto || ""}
                      onChange={(e) => handleChange("scadenzaContratto", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 dark-calendar"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Canone Mensile (€)
                    </label>
                    <input
                      type="text"
                      value={newDriver.canoneMensile || ""}
                      onChange={(e) => handleChange("canoneMensile", parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Km Contrattuali
                    </label>
                    <input
                      type="text"
                      value={newDriver.kmContrattuali || ""}
                      onChange={(e) => handleChange("kmContrattuali", parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onSave}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                } transition-colors disabled:opacity-50`}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Salvataggio..." : "Salva Driver"}
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${isDarkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
                } transition-colors`}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverForm;
