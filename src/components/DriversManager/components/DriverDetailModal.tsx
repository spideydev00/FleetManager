import React from "react";
import { Driver } from "../../../entities/types";
import { X, Edit, User, Car, Building2, Calendar, Euro, FileText } from "lucide-react";
import AttachmentsManager from "./AttachmentsManager";

interface DriverDetailModalProps {
  driver: Driver;
  isDarkMode: boolean;
  onClose: () => void;
  onEdit: (driver: Driver) => void;
  formatCurrency: (amount?: number | null) => string;
  refreshDriver: () => void;
}

const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  driver,
  isDarkMode,
  onClose,
  onEdit,
  formatCurrency,
  refreshDriver,
}) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Non specificato";
    return new Date(dateString).toLocaleDateString("it-IT");
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
            <User className="w-6 h-6 text-blue-500" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Dettagli Driver
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(driver)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
                }`}
              title="Modifica driver"
            >
              <Edit className="w-5 h-5" />
            </button>
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
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <User className="w-5 h-5" />
                Informazioni Driver
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Nome Driver
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.nomeDriver || "Non specificato"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Centro di Costo
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.centroCosto || "Non specificato"}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <Building2 className="w-5 h-5" />
                Informazioni Aziendali
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Società
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.societa || "Non specificato"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Noleggiatore
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.noleggiatore || "Non specificato"}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <Car className="w-5 h-5" />
                Informazioni Veicolo
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Targa
                  </label>
                  <p className={`mt-1 font-mono ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.targa || "Non specificato"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Marca e Modello
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {`${driver.marca || ""} ${driver.modello || ""}`.trim() || "Non specificato"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Alimentazione
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.alimentazione || "Non specificato"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Emissioni
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.emissioni || "Non specificato"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <Calendar className="w-5 h-5" />
                Informazioni Contratto
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Inizio Contratto
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {formatDate(driver.inizioContratto)}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Scadenza Contratto
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {formatDate(driver.scadenzaContratto)}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Canone Mensile
                  </label>
                  <p className={`mt-1 font-semibold text-green-600 ${isDarkMode ? "text-green-400" : ""}`}>
                    {formatCurrency(driver.canoneMensile)}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Km Contrattuali
                  </label>
                  <p className={`mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {driver.kmContrattuali?.toLocaleString() || "0"} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <AttachmentsManager
            driver={driver}
            isDarkMode={isDarkMode}
            onAttachmentsChange={refreshDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
