import React, { useState } from "react";
import { X } from "lucide-react";
import { User, UserRole } from "../../types";

interface UserProfileProps {
  currentUser: User | null;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<void>;
  onClose: () => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onUpdateProfile,
  onClose,
  isDarkMode,
  isLoading = false,
}) => {
  const [editingProfile, setEditingProfile] = useState(false);

  if (!currentUser) return null;

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    try {
      await onUpdateProfile(updatedData);
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          setEditingProfile(false);
        }
      }}
    >
      <div
        className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          } rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div
          className={`relative px-6 py-8 ${currentUser.role === UserRole.CREATOR
            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700"
            : currentUser.role === UserRole.MANAGER
              ? "bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600"
              : "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600"
            }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            title="Close profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-25 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.nome
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>
          </div>
          <div className="text-center text-white">
            <h2 className="text-xl font-bold">{currentUser.nome}</h2>
            <p className="text-white/70 text-sm mt-1">{currentUser.email}</p>
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${currentUser.role === UserRole.CREATOR
                  ? "bg-red-400 text-white"
                  : currentUser.role === UserRole.MANAGER
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-green-400 text-green-900"
                  }`}
              >
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!editingProfile ? (
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Email
                </h3>
                <p
                  className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  {currentUser.email}
                </p>
              </div>

              {currentUser.azienda && (
                <div>
                  <h3
                    className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    Azienda
                  </h3>
                  <p
                    className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {currentUser.azienda}
                  </p>
                </div>
              )}

              {currentUser.telefono && (
                <div>
                  <h3
                    className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    Telefono
                  </h3>
                  <p
                    className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {currentUser.telefono}
                  </p>
                </div>
              )}

              <div>
                <h3
                  className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Data creazione
                </h3>
                <p
                  className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  {currentUser.dataCreazione
                    ? new Date(currentUser.dataCreazione).toLocaleDateString(
                      "it-IT"
                    )
                    : "Data non disponibile"}
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Ultimo accesso
                </h3>
                <p
                  className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  {currentUser.ultimoAccesso
                    ? new Date(currentUser.ultimoAccesso).toLocaleString(
                      "it-IT"
                    )
                    : "Primo accesso"}
                </p>
              </div>

              <button
                onClick={() => setEditingProfile(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Modifica Profilo
              </button>
            </div>
          ) : (
            <EditProfileForm
              user={currentUser}
              onSave={handleUpdateProfile}
              onCancel={() => setEditingProfile(false)}
              isDarkMode={isDarkMode}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Component for profile editing
interface EditProfileFormProps {
  user: User;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onSave,
  onCancel,
  isDarkMode,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nome: user.nome || "",
    email: user.email || "",
    azienda: user.azienda || "",
    telefono: user.telefono || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.email) {
      onSave(formData);
    } else {
      alert("Please fill in all required fields (Name, Email)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3
          className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
        >
          ✏️ Modifica Profilo
        </h3>
        <p
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Modifica informazioni personali
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Nome
          </label>
          <input
            type="text"
            required
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Full name"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Email
          </label>
          <input
            type="email"
            required
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email@company.com"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Azienda (opzionale)
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={formData.azienda}
            onChange={(e) =>
              setFormData({ ...formData, azienda: e.target.value })
            }
            placeholder="Nome Azienda"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Telefono (opzionale)
          </label>
          <input
            type="tel"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
              }`}
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            placeholder="+39 123 456 7890"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium ${isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Salvando...</span>
            </>
          ) : (
            <span>Salva Modifiche</span>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium ${isDarkMode
            ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <span>Annulla</span>
        </button>
      </div>
    </form>
  );
};

export default UserProfile;
