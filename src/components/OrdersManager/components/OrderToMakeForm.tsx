import React from "react";
import { Search, Trash2, X } from "lucide-react";
import { Driver, OrderToMake } from "../../../entities/types";

interface OrderToMakeFormProps {
  isDarkMode: boolean;
  isVisible: boolean;
  drivers: Driver[];
  editingOrderToMake: OrderToMake | null;
  setEditingOrderToMake: (order: OrderToMake | null) => void;
  orderToMakeDriverSearchTerm: string;
  setOrderToMakeDriverSearchTerm: (term: string) => void;
  onClose: () => void;
  onSave: () => void;
  onUpdate: () => void;
  onCreateOrder?: (driverId: string) => void;
  isLoading: boolean;
}

const OrderToMakeForm: React.FC<OrderToMakeFormProps> = ({
  isDarkMode,
  isVisible,
  drivers,
  editingOrderToMake,
  setEditingOrderToMake,
  orderToMakeDriverSearchTerm,
  setOrderToMakeDriverSearchTerm,
  onClose,
  onSave,
  onUpdate,
  onCreateOrder,
  isLoading,
}) => {
  if (!isVisible || !editingOrderToMake) return null;

  const calculateOrderToMakeStatus = (
    orderToMake: OrderToMake
  ): "Non iniziata" | "In corso" | "Completata" => {
    const states = [
      orderToMake.scelta_auto,
      orderToMake.rda,
      orderToMake.offerte,
      orderToMake.verifica,
      orderToMake.firme,
    ];

    const allCompleted = states.every((state) => state === "Completata");
    if (allCompleted) return "Completata";

    const someInProgress = states.some(
      (state) => state === "Completata" || state === "In corso"
    );
    if (someInProgress) return "In corso";

    return "Non iniziata";
  };

  const handleFieldChange = (field: string, value: string) => {
    const updatedOrder = { ...editingOrderToMake, [field]: value };
    const calculatedStatus = calculateOrderToMakeStatus(updatedOrder);

    const newOrder = { ...updatedOrder, stato: calculatedStatus };
    setEditingOrderToMake(newOrder);
  };

  const handleUpdate = () => {
    // Check if all fields are completed and trigger order creation after update
    if (editingOrderToMake && editingOrderToMake.stato === "Completata" && onCreateOrder && editingOrderToMake.driver_id) {
      // First update the OrderToMake, then create the Order
      onUpdate();
      setTimeout(() => {
        onCreateOrder(editingOrderToMake.driver_id);
      }, 500);
    } else {
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          } rounded-lg p-6 m-4 max-w-3xl w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            {editingOrderToMake.id
              ? "Modifica Ordine da Fare"
              : "Nuovo Ordine da Fare"}
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
              {editingOrderToMake.driver_id ? (
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
                      {editingOrderToMake.nome_driver}
                    </div>
                    {drivers.find(
                      (d) => d.id === editingOrderToMake.driver_id
                    ) && (
                        <div
                          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          {
                            drivers.find(
                              (d) => d.id === editingOrderToMake.driver_id
                            )?.marca
                          }{" "}
                          {
                            drivers.find(
                              (d) => d.id === editingOrderToMake.driver_id
                            )?.modello
                          }
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOrderToMake({
                        ...editingOrderToMake,
                        driver_id: "",
                        nome_driver: "",
                      });
                      setOrderToMakeDriverSearchTerm("");
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
                      value={orderToMakeDriverSearchTerm}
                      onChange={(e) =>
                        setOrderToMakeDriverSearchTerm(e.target.value)
                      }
                    />
                  </div>

                  {orderToMakeDriverSearchTerm && (
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
                            .includes(orderToMakeDriverSearchTerm.toLowerCase())
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
                              setEditingOrderToMake({
                                ...editingOrderToMake,
                                driver_id: driver.id,
                                nome_driver: driver.nomeDriver,
                              });
                              setOrderToMakeDriverSearchTerm("");
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
                          .includes(orderToMakeDriverSearchTerm.toLowerCase())
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

          {/* Status Overview */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Stato Complessivo
            </label>
            <div
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-100 border-gray-200 text-gray-900"
                }`}
            >
              {editingOrderToMake.stato || "Non iniziata"}
              <p className="text-xs text-gray-500 mt-1">
                Lo stato viene calcolato automaticamente in base agli altri
                campi
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Scelta Auto
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrderToMake.scelta_auto || "Non iniziata"}
              onChange={(e) => handleFieldChange("scelta_auto", e.target.value)}
            >
              <option value="Non iniziata">Non iniziata</option>
              <option value="In corso">In corso</option>
              <option value="Completata">Completata</option>
            </select>
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              RDA
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrderToMake.rda || "Non iniziata"}
              onChange={(e) => handleFieldChange("rda", e.target.value)}
            >
              <option value="Non iniziata">Non iniziata</option>
              <option value="In corso">In corso</option>
              <option value="Completata">Completata</option>
            </select>
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Offerte
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrderToMake.offerte || "Non iniziata"}
              onChange={(e) => handleFieldChange("offerte", e.target.value)}
            >
              <option value="Non iniziata">Non iniziata</option>
              <option value="In corso">In corso</option>
              <option value="Completata">Completata</option>
            </select>
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Verifica
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrderToMake.verifica || "Non iniziata"}
              onChange={(e) => handleFieldChange("verifica", e.target.value)}
            >
              <option value="Non iniziata">Non iniziata</option>
              <option value="In corso">In corso</option>
              <option value="Completata">Completata</option>
            </select>
          </div>

          <div>
            <label
              className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Firme
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
              value={editingOrderToMake.firme || "Non iniziata"}
              onChange={(e) => handleFieldChange("firme", e.target.value)}
            >
              <option value="Non iniziata">Non iniziata</option>
              <option value="In corso">In corso</option>
              <option value="Completata">Completata</option>
            </select>
          </div>
        </div>

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
            onClick={editingOrderToMake.id ? handleUpdate : onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!editingOrderToMake.nome_driver || isLoading}
          >
            {isLoading
              ? "Salvataggio..."
              : editingOrderToMake.id
                ? "Aggiorna"
                : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderToMakeForm;
