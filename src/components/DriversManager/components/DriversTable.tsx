import React from "react";
import { Driver } from "../../../entities/types";
import { Eye, Edit, Trash2, Car } from "lucide-react";

interface DriversTableProps {
  drivers: Driver[];
  filteredDrivers: Driver[];
  selectedDrivers: string[];
  isDarkMode: boolean;
  onSelectAll: () => void;
  onSelectDriver: (driverId: string) => void;
  onViewDriver: (driver: Driver) => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
}

const DriversTable: React.FC<DriversTableProps> = ({
  drivers,
  filteredDrivers,
  selectedDrivers,
  isDarkMode,
  onSelectAll,
  onSelectDriver,
  onViewDriver,
  onEditDriver,
  onDeleteDriver,
}) => {
  const formatCurrency = (amount?: number | null) => {
    const v = amount ?? 0;
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(v);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("it-IT");
  };

  return (
    <div className={`rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} overflow-hidden`}>
      {/* Table Header */}
      <div className={`px-6 py-4 border-b ${isDarkMode ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Driver ({filteredDrivers.length})
          </h3>
          {filteredDrivers.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDrivers.length === filteredDrivers.length}
                onChange={onSelectAll}
                className="rounded"
              />
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Seleziona tutti
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      {filteredDrivers.length === 0 ? (
        <div className="p-12 text-center">
          <Car className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Nessun driver trovato
          </h3>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {drivers.length === 0 ? "Aggiungi il tuo primo driver" : "Prova a modificare i filtri di ricerca"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} sticky top-0 z-10`}>
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <span className="sr-only">Seleziona</span>
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Driver
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Veicolo
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Noleggiatore
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Contratto
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Canone
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? "bg-gray-800" : "bg-white"} divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className={`${isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-50"} transition-colors`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDrivers.includes(driver.id)}
                      onChange={() => onSelectDriver(driver.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {driver.nomeDriver || "-"}
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {driver.centroCosto || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {driver.targa || "-"}
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {`${driver.marca || ""} ${driver.modello || ""}`.trim() || "-"} - {driver.alimentazione || ""}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {driver.noleggiatore || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {driver.inizioContratto || driver.scadenzaContratto
                          ? `${formatDate(driver.inizioContratto)} - ${formatDate(driver.scadenzaContratto)}`
                          : "-"
                        }
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {driver.kmContrattuali?.toLocaleString() || "0"} km
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm">
                      {formatCurrency(driver.canoneMensile)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewDriver(driver)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-gray-700 text-blue-500 hover:text-blue-400"
                          : "hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                          }`}
                        title="Visualizza dettagli"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditDriver(driver)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-gray-700 text-orange-500 hover:text-orange-400"
                          : "hover:bg-orange-50 text-orange-600 hover:text-orange-700"
                          }`}
                        title="Modifica driver"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDriver(driver.id)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-gray-700 text-red-500 hover:text-red-400"
                          : "hover:bg-red-50 text-red-600 hover:text-red-700"
                          }`}
                        title="Elimina driver"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriversTable;
