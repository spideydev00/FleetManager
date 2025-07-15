import React, { useEffect } from "react";
import { Search, Trash2, X } from "lucide-react";
import { Driver, Order } from "../../../types";
import { ordersService } from "../services/ordersService";
import { getEmissionsNumericValue } from "../../../utils/getEmissionsAsNumber";

interface OrderFormProps {
  isDarkMode: boolean;
  isVisible: boolean;
  drivers: Driver[];
  editingOrder: Order | null;
  setEditingOrder: (order: Order | null) => void;
  driverSearchTerm: string;
  setDriverSearchTerm: (term: string) => void;
  driverData: Partial<Driver> | null;
  setDriverData: (data: Partial<Driver> | null) => void;
  onClose: () => void;
  onSave: () => void;
  onUpdate: () => void;
  isLoading: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isDarkMode,
  isVisible,
  drivers,
  editingOrder,
  setEditingOrder,
  driverSearchTerm,
  setDriverSearchTerm,
  driverData,
  setDriverData,
  onClose,
  onSave,
  onUpdate,
  isLoading,
}) => {
  // Generate order code automatically for new orders
  useEffect(() => {
    const generateOrderCode = async () => {
      if (editingOrder && !editingOrder.id && !editingOrder.ordine) {
        try {
          const orderCode = await ordersService.generateOrderCode();
          setEditingOrder({ ...editingOrder, ordine: orderCode });
        } catch (error) {
          console.error("Error generating order code:", error);
        }
      }
    };

    if (isVisible && editingOrder) {
      generateOrderCode();
    }
  }, [isVisible, editingOrder?.id]);

  if (!isVisible || !editingOrder) return null;

  const fetchDriverData = (driverId: string) => {
    const selectedDriver = drivers.find((d) => d.id === driverId);
    if (selectedDriver) {
      setDriverData({
        id: selectedDriver.id,
        nomeDriver: selectedDriver.nomeDriver,
        centroCosto: selectedDriver.centroCosto,
        societa: selectedDriver.societa,
        noleggiatore: selectedDriver.noleggiatore,
        marca: selectedDriver.marca,
        modello: selectedDriver.modello,
        targa: selectedDriver.targa,
        alimentazione: selectedDriver.alimentazione,
        emissioni: selectedDriver.emissioni,
        inizioContratto: selectedDriver.inizioContratto,
        scadenzaContratto: selectedDriver.scadenzaContratto,
        canoneMensile: selectedDriver.canoneMensile,
        kmContrattuali: selectedDriver.kmContrattuali,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          } rounded-lg p-6 m-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            {editingOrder.id ? "Modifica Ordine" : "Nuovo Ordine"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Driver Selection */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Driver*
            </label>
            <div className="space-y-2">
              {editingOrder.driver_id ? (
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
                      {editingOrder.nome_driver}
                    </div>
                    {driverData && (
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        {driverData.marca} {driverData.modello}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOrder({
                        ...editingOrder,
                        driver_id: "",
                        nome_driver: "",
                        marca: "",
                        modello: "",
                        fornitore: "",
                      });
                      setDriverData(null);
                      setDriverSearchTerm("");
                    }}
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
                            onClick={() => {
                              setEditingOrder({
                                ...editingOrder,
                                driver_id: driver.id,
                                nome_driver: driver.nomeDriver,
                                marca: driver.marca || "",
                                modello: driver.modello || "",
                                fornitore: driver.noleggiatore || "",
                              });
                              fetchDriverData(driver.id);
                              setDriverSearchTerm("");
                            }}
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
                              {driver.marca} {driver.modello}
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

          {/* Order Code */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Codice Ordine
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrder.ordine || ""}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, ordine: e.target.value })
              }
              placeholder="Generato automaticamente"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: ORD-YYYY-XXX (es. ORD-2023-001). Se lasciato vuoto, verrà
              generato automaticamente.
            </p>
          </div>

          {/* Order Date */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Data Ordine*
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 dark-calendar"
                : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={
                editingOrder.data_ordine ||
                new Date().toISOString().split("T")[0]
              }
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  data_ordine: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Stato
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2"
                checked={editingOrder.consegnata || false}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    consegnata: e.target.checked,
                  })
                }
              />
              <span
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Ordine consegnato
              </span>
            </div>
          </div>
        </div>

        {/* Driver Data Fields */}
        {editingOrder.driver_id && driverData && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
            >
              <h4
                className={`text-md font-semibold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
              >
                Dati del Driver
              </h4>

              {/* Personal Information */}
              <div className="mb-4">
                <h5
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Anagrafica
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Nome Driver
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.nomeDriver || ""}
                      onChange={(e) => {
                        setDriverData({
                          ...driverData,
                          nomeDriver: e.target.value,
                        });
                        setEditingOrder({
                          ...editingOrder,
                          nome_driver: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Centro di Costo
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.centroCosto || ""}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          centroCosto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Società
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.societa || ""}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          societa: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-4">
                <h5
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Veicolo
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Noleggiatore / Fornitore *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.noleggiatore || ""}
                      onChange={(e) => {
                        setDriverData({
                          ...driverData,
                          noleggiatore: e.target.value,
                        });
                        setEditingOrder({
                          ...editingOrder,
                          fornitore: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Marca *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.marca || ""}
                      onChange={(e) => {
                        setDriverData({ ...driverData, marca: e.target.value });
                        setEditingOrder({
                          ...editingOrder,
                          marca: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Modello *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.modello || ""}
                      onChange={(e) => {
                        setDriverData({
                          ...driverData,
                          modello: e.target.value,
                        });
                        setEditingOrder({
                          ...editingOrder,
                          modello: e.target.value,
                        });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                      Emissioni
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={getEmissionsNumericValue(driverData.emissioni)}
                        onChange={(e) =>
                          setDriverData({
                            ...driverData,
                            emissioni: `${e.target.value}g/km`,
                          })
                        }
                        className={`w-20 px-3 py-2 rounded-lg border text-sm ${isDarkMode
                          ? "bg-gray-800 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                        placeholder="0"
                      />
                      <div className={`px-3 py-2 rounded-r-lg border border-l-0 ${isDarkMode
                        ? "bg-gray-700 border-gray-500 text-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                        } flex items-center text-sm font-medium`}>
                        g/km
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="mb-2">
                <h5
                  className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Contratto
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Inizio Contratto
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100 dark-calendar"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={
                        driverData.inizioContratto
                          ? new Date(driverData.inizioContratto)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          inizioContratto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Scadenza Contratto
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100 dark-calendar"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={
                        driverData.scadenzaContratto
                          ? new Date(driverData.scadenzaContratto)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          scadenzaContratto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Canone Mensile (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.canoneMensile || ""}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          canoneMensile: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      KM Contrattuali
                    </label>
                    <input
                      type="number"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                      value={driverData.kmContrattuali || ""}
                      onChange={(e) =>
                        setDriverData({
                          ...driverData,
                          kmContrattuali: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Annulla
          </button>
          <button
            onClick={editingOrder.id ? onUpdate : onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !editingOrder.nome_driver ||
              !editingOrder.marca ||
              !editingOrder.modello ||
              !editingOrder.fornitore ||
              isLoading
            }
          >
            {isLoading
              ? "Salvataggio..."
              : editingOrder.id
                ? "Aggiorna"
                : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
