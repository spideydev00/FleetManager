import React, { useState } from "react";
import { User as UserType } from "../../types";

interface HeaderProps {
  currentUser: UserType | null;
  setShowUserProfile: (show: boolean) => void;
  handleLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showUserProfile?: boolean;
  showUserProfileMenu?: boolean;
  setShowUserProfileMenu?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  setShowUserProfile,
  handleLogout,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!currentUser) return null;

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } border-b px-6 py-3`}
    >
      <div className="flex justify-between items-center">
        <div>{/* Breadcrumbs or other header content can be added here */}</div>

        <div className="flex items-center space-x-4">
          {/* Uncomment the following line to display the current date */}
          {/* <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {new Date().toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2> */}

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            title={isDarkMode ? "Passa a tema chiaro" : "Passa a tema scuro"}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 p-2 rounded-full ${
                isDarkMode
                  ? "hover:bg-gray-800 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              title="Profilo utente"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentUser.role === "Creatore"
                    ? "bg-red-500"
                    : currentUser.role === "Manager"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                } text-white font-semibold`}
              >
                {currentUser.nome.charAt(0)}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {currentUser.nome}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden sm:block"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
                  isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                }`}
              >
                <button
                  onClick={() => {
                    setShowUserProfile(true);
                    setShowUserMenu(false);
                  }}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Profilo
                </button>
                <button
                  onClick={handleLogout}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
