import React from "react";
import { User } from "../../entities/types";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  hasSubmenu?: boolean;
  submenu?: { id: string; label: string }[];
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isDarkMode: boolean;
  menuItems: MenuItem[];
  currentUser: User | null;
  showOrdersSubmenu: boolean;
  setShowOrdersSubmenu: (show: boolean) => void;
  showSupportSubmenu: boolean;
  setShowSupportSubmenu: (show: boolean) => void;
  activeOrderTab: string;
  setActiveOrderTab: (tab: string) => void;
  activeSupportTab: string;
  setActiveSupportTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isDarkMode,
  menuItems,
  currentUser,
  showOrdersSubmenu,
  setShowOrdersSubmenu,
  showSupportSubmenu,
  setShowSupportSubmenu,
  activeOrderTab,
  setActiveOrderTab,
  activeSupportTab,
  setActiveSupportTab,
}) => {
  const handleMenuClick = (
    menuId: string,
    hasSubmenu?: boolean,
    submenuSetter?: (show: boolean) => void
  ) => {
    if (hasSubmenu && submenuSetter) {
      submenuSetter(true);
    } else {
      setActiveSection(menuId);

      // Reset submenu states if not clicking on a submenu item
      if (menuId !== "orders" && menuId !== "inCorso" && menuId !== "daFare") {
        setShowOrdersSubmenu(false);
      }
      // RIMOSSO: setShowSupportSubmenu(false);
    }
  };

  const handleOrderTabClick = (tabId: string) => {
    setActiveOrderTab(tabId);
    setActiveSection(tabId);
  };

  // RIMOSSO: const handleSupportTabClick = (tabId: string) => { ... }

  if (!currentUser) return null;

  return (
    <div className="h-full flex flex-col w-64 min-w-[16rem] max-w-[16rem]">
      {/* Logo and title */}

      {/* Logo */}
      {/* <div className="pt-6 flex justify-center mb-8">
        <img
          src="/src/assets/images/tars-logo.png"
          alt="TARS Logo"
          className="h-24 w-24 object-contain"
          onError={(e) => {
            // Nasconde l'immagine se non viene trovata
            e.currentTarget.style.display = 'none';
          }}
        />
      </div> */}

      <div
        className={`py-6 px-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">FM</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">Fleet Manager</h1>
            <p className="text-xs opacity-70">Gestione flotta aziendale</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
          } mx-4 my-2`}
      ></div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => {
              // Mostra tutto tranne "Database Utenti" agli utenti normali
              // "Database Utenti" è visibile solo a chi ha ruolo "Creatore"
              if (item.id === "database") {
                return currentUser?.role === "Creatore";
              }
              return true; // Mostra tutte le altre voci a tutti gli utenti indipendentemente dal ruolo
            })
            .map((item) => (
              <li key={item.id}>
                {/* Main menu item */}
                <button
                  onClick={() =>
                    handleMenuClick(
                      item.id,
                      item.hasSubmenu,
                      item.id === "orders" ? setShowOrdersSubmenu : undefined
                      // RIMOSSO: item.id === "support" ? setShowSupportSubmenu : undefined
                    )
                  }
                  className={`tars-menu-item w-full flex items-center px-3 py-2 rounded-lg transition-all ${activeSection === item.id ||
                    (item.id === "orders" &&
                      (activeSection === "inCorso" ||
                        activeSection === "daFare"))
                    ? isDarkMode
                      ? "bg-blue-900 text-blue-100"
                      : "bg-blue-100 text-blue-800"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && item.id === "orders" && (
                    <span>{showOrdersSubmenu ? "▼" : "▶"}</span>
                  )}
                  {/* RIMOSSO: {item.hasSubmenu && item.id === "support" ...} */}
                </button>

                {/* Submenu for Orders */}
                {item.id === "orders" && showOrdersSubmenu && item.submenu && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => handleOrderTabClick(subItem.id)}
                          className={`tars-menu-item w-full text-left px-3 py-1.5 rounded-lg text-sm ${activeOrderTab === subItem.id
                            ? isDarkMode
                              ? "bg-blue-800 text-blue-100"
                              : "bg-blue-50 text-blue-700"
                            : isDarkMode
                              ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* RIMOSSO: Submenu for Support */}
              </li>
            ))}
        </ul>
      </nav>

      {/* User info */}
      <div className={`p-4 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
        <div
          className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentUser?.role === "Creatore"
                ? "bg-red-500"
                : currentUser?.role === "Manager"
                  ? "bg-yellow-500"
                  : "bg-green-500"
                } text-white font-semibold`}
            >
              {currentUser?.nome?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm truncate">
                {currentUser?.nome || "User"}
              </p>
              <p
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {currentUser?.role === "Creatore"
                  ? "Creator"
                  : currentUser?.role === "Manager"
                    ? "Manager"
                    : "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
