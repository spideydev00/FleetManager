import React, { useState, useRef, useEffect } from "react";
import { Car, CreditCard, BarChart3, FileText } from "lucide-react";
import * as XLSX from "xlsx";

import { supabase } from "../supabase";

// Import services
import { authService } from "./Auth/services/authService";
import { driversService } from "./DriversManager/services/driversService";
import { ordersService } from "./OrdersManager/services/ordersService";
import { fuelCardsService } from "./FuelCardsManager/services/fuelCardsService";

// Import components
import Dashboard from "./Dashboard";
import DriversManager from "./DriversManager";
import OrdersManager from "./OrdersManager";
import FuelCardsManager from "./FuelCardsManager";
import ReportsManager from "./ReportsManager";
import LoginForm from "./Auth/LoginForm";
import Sidebar from "./Layout/Sidebar";
import Header from "./Layout/Header";
import UserProfile from "./Auth/UserProfile";

import {
  User,
  UserRole,
  Driver,
  Order,
  OrderToMake,
  FuelCard,
  Message,
  FAQ,
} from "../types";

const FleetManagement: React.FC = () => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // UI states
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Order management states
  const [activeOrderTab, setActiveOrderTab] = useState("inCorso");
  const [ordersToMake, setOrdersToMake] = useState<OrderToMake[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // FuelCard management states
  const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);

  // UI layout states
  const [showOrdersSubmenu, setShowOrdersSubmenu] = useState(false);
  const [showSupportSubmenu, setShowSupportSubmenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserProfileMenu, setShowUserProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Support UI state
  const [activeSupportTab, setActiveSupportTab] = useState("faq");

  // Reference for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Driver management states
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { user, error } = await authService.validateSession();

        if (error) throw error;

        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Fetch all data when user logs in and setup real-time listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Starting to fetch data using services...");

        // Fetch drivers
        try {
          const { data: driverData, error: driverError } =
            await driversService.fetchDrivers();
          if (driverError) {
            console.error("Error fetching drivers:", driverError);
          } else {
            setDrivers(driverData || []);
          }
        } catch (error) {
          console.error("Failed to fetch drivers:", error);
        }

        // Fetch orders
        try {
          const { data: orderData, error: orderError } =
            await ordersService.fetchOrders();
          if (orderError) {
            console.error("Error fetching orders:", orderError);
          } else {
            setOrders(orderData || []);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }

        // Fetch orders to make
        try {
          const { data: ordersToMakeData, error: ordersToMakeError } =
            await ordersService.fetchOrdersToMake();
          if (ordersToMakeError) {
            console.error("Error fetching orders to make:", ordersToMakeError);
          } else {
            setOrdersToMake(ordersToMakeData || []);
          }
        } catch (error) {
          console.error("Failed to fetch orders to make:", error);
        }

        // Fetch fuel cards
        try {
          const { data: fuelCardData, error: fuelCardError } =
            await fuelCardsService.fetchFuelCards();
          if (fuelCardError) {
            console.error("Error fetching fuel cards:", fuelCardError);
          } else {
            setFuelCards(fuelCardData || []);
          }
        } catch (error) {
          console.error("Failed to fetch fuel cards:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions using Supabase's built-in realtime
    const driversSubscription = supabase
      .channel("drivers_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
        },
        async () => {
          const { data } = await driversService.fetchDrivers();
          if (data) setDrivers(data);
        }
      )
      .subscribe();

    const ordersSubscription = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          const { data } = await ordersService.fetchOrders();
          if (data) setOrders(data);
        }
      )
      .subscribe();

    const fuelCardsSubscription = supabase
      .channel("fuel_cards_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fuel_cards",
        },
        async () => {
          const { data } = await fuelCardsService.fetchFuelCards();
          if (data) setFuelCards(data);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(driversSubscription);
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(fuelCardsSubscription);
    };
  }, [isLoggedIn, currentUser?.role]);

  // Dark mode setup
  useEffect(() => {
    // Check if dark mode preference is stored
    const storedDarkMode = localStorage.getItem("fleetDarkMode");
    if (storedDarkMode) {
      setIsDarkMode(storedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDarkMode);
    }

    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]);

  // Login/Logout functions with auth service
  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const { user, error } = await authService.signIn(
        loginForm.email,
        loginForm.password
      );

      if (error) throw error;

      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setLoginError("");
        setLoginForm({ email: "", password: "" });
      } else {
        setLoginError("Utente non trovato");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Errore durante il login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const { error } = await authService.signOut();
      if (error) throw error;

      setCurrentUser(null);
      setIsLoggedIn(false);
      setActiveSection("dashboard");
    } catch (error: any) {
      console.error("Logout error:", error);
      alert(`Errore durante il logout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("fleetDarkMode", String(newDarkMode));
  };

  // File upload handler for different data types
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsLoading(true);
        if (!e.target?.result) return;

        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          alert("Nessun dato trovato nel file Excel");
          return;
        }

        switch (type) {
          case "drivers":
            const { data: driverData, error: driverError } =
              await driversService.importDriversFromExcel(jsonData);
            if (driverError) throw driverError;
            setDrivers(driverData || []);
            alert(`Importati ${jsonData.length} driver con successo`);
            break;

          case "orders":
            const { data: orderData, error: orderError } =
              await ordersService.importOrdersFromExcel(jsonData);
            if (orderError) throw orderError;
            setOrders(orderData || []);
            alert(`Importati ${jsonData.length} ordini con successo`);
            break;

          case "fuelCards":
            const { data: fuelCardData, error: fuelCardError } =
              await fuelCardsService.importFuelCardsFromExcel(jsonData);
            if (fuelCardError) throw fuelCardError;
            setFuelCards(fuelCardData || []);
            alert(`Importate ${jsonData.length} fuel card con successo`);
            break;

          default:
            alert("Tipo di importazione non supportato");
            break;
        }
      } catch (error: any) {
        console.error("Errore import Excel:", error);
        alert(
          `❌ Errore durante l'importazione del file Excel: ${error.message}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);

    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  // Update user profile
  const updateCurrentUserProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);

      const { user, error } = await authService.updateProfile(
        currentUser.id,
        updatedData
      );

      if (error) throw error;

      if (user) {
        setCurrentUser(user);
        setEditingProfile(false);
        setShowUserProfile(false);
        alert("Profilo aggiornato con successo!");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`Errore durante l'aggiornamento del profilo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Define the menuItems array (removed database section)
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      roles: ["Creatore", "Manager", "User"],
    },
    {
      id: "drivers",
      label: "Gestione Driver",
      icon: Car,
      roles: ["Creatore", "Manager", "User"],
    },
    {
      id: "orders",
      label: "Ordini",
      icon: FileText,
      roles: ["Creatore", "Manager", "User"],
      hasSubmenu: true,
      submenu: [
        { id: "inCorso", label: "Ordini in Corso" },
        { id: "daFare", label: "Ordini da Fare" },
      ],
    },
    {
      id: "fuelcards",
      label: "Fuel Cards",
      icon: CreditCard,
      roles: ["Creatore", "Manager", "User"],
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      roles: ["Creatore", "Manager", "User"],
    },
    // Removed database section entirely
  ];

  // Listen for driver updates from child components
  useEffect(() => {
    const handleDriverUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { driverId, updatedData } = customEvent.detail;

      // Update the drivers array with the new data
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === driverId
            ? {
              ...driver,
              nomeDriver: updatedData.nomeDriver,
              centroCosto: updatedData.centroCosto,
              societa: updatedData.societa,
              noleggiatore: updatedData.noleggiatore,
              marca: updatedData.marca,
              modello: updatedData.modello,
              targa: updatedData.targa,
              alimentazione: updatedData.alimentazione,
              emissioni: updatedData.emissioni,
              inizioContratto: updatedData.inizioContratto,
              scadenzaContratto: updatedData.scadenzaContratto,
              canoneMensile: updatedData.canoneMensile,
              kmContrattuali: updatedData.kmContrattuali,
            }
            : driver
        )
      );
    };

    // Add event listener for the custom event
    window.addEventListener("driverUpdated", handleDriverUpdate);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("driverUpdated", handleDriverUpdate);
    };
  }, []);

  // Render appropriate section based on active section
  const renderSection = () => {
    // Show loading indicator when data is being fetched
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Caricamento...
          </span>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            drivers={drivers}
            orders={orders}
            fuelCards={fuelCards}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDarkMode={isDarkMode}
            currentUser={currentUser}
          />
        );

      case "drivers":
        return (
          <DriversManager
            drivers={drivers}
            setDrivers={setDrivers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDarkMode={isDarkMode}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
          />
        );

      case "inCorso":
      case "daFare":
        return (
          <OrdersManager
            orders={orders}
            setOrders={setOrders}
            ordersToMake={ordersToMake}
            setOrdersToMake={setOrdersToMake}
            drivers={drivers}
            activeTab={activeOrderTab}
            setActiveTab={setActiveOrderTab}
            handleFileUpload={handleFileUpload}
            isDarkMode={isDarkMode}
          />
        );

      case "fuelcards":
        return (
          <FuelCardsManager
            fuelCards={fuelCards}
            setFuelCards={setFuelCards}
            drivers={drivers}
            isDarkMode={isDarkMode}
            handleFileUpload={handleFileUpload}
          />
        );

      case "reports":
        return <ReportsManager drivers={drivers} isDarkMode={isDarkMode} />;

      case "faq":

      default:
        return (
          <div className="p-6">
            <p
              className={`text-xl ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              Seleziona una sezione dal menu
            </p>
          </div>
        );
    }
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex">
        {/* Left column - Login form */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          <LoginForm
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            loginError={loginError}
            handleLogin={handleLogin}
            isDarkMode={isDarkMode}
            isLoading={isLoading}
          />
        </div>

        {/* Right column - Simple and clean */}
        <div className="flex-1 relative bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>

          <div className="absolute inset-0 opacity-5">
            {/* Background pattern or image could go here */}
          </div>

          <div className="relative h-full flex flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-4xl font-bold mb-2">TARS</h1>
              <p className="text-gray-300">
                Sistema completo di gestione flotta aziendale
              </p>
            </div>

            {/* Logo */}
            <div className="flex justify-start">
              <img
                src="/src/assets/images/tars-logo.png"
                alt="TARS Logo"
                className="h-64 w64 object-contain"
                onError={(e) => {
                  // Nasconde l'immagine se non viene trovata
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">
                  Caratteristiche principali:
                </h3>
                <ul className="space-y-1 list-disc list-inside text-gray-300">
                  <li>Gestione completa di driver e veicoli</li>
                  <li>Monitoraggio ordini e fuel cards</li>
                  <li>Report dettagliati ed esportabili</li>
                </ul>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Sviluppato da SpideyDev
                  <br />
                  &copy; {new Date().getFullYear()} • Tutti i diritti riservati
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main application
  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-64 min-w-[16rem] max-w-[16rem] ${isDarkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-white to-gray-50"
            } shadow-xl h-screen sticky top-0 border-r ${isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isDarkMode={isDarkMode}
            menuItems={menuItems}
            currentUser={currentUser}
            showOrdersSubmenu={showOrdersSubmenu}
            setShowOrdersSubmenu={setShowOrdersSubmenu}
            showSupportSubmenu={showSupportSubmenu}
            setShowSupportSubmenu={setShowSupportSubmenu}
            activeOrderTab={activeOrderTab}
            setActiveOrderTab={setActiveOrderTab}
            activeSupportTab={activeSupportTab}
            setActiveSupportTab={setActiveSupportTab}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header
            currentUser={currentUser}
            setShowUserProfile={setShowUserProfile}
            handleLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {/* Content */}
          <main
            className={`flex-1 p-6 overflow-auto ${isDarkMode ? "bg-gray-900" : "bg-gray-100"
              }`}
          >
            {renderSection()}
          </main>
        </div>
      </div>

      {/* User profile modal */}
      {showUserProfile && currentUser && (
        <UserProfile
          currentUser={currentUser}
          onUpdateProfile={updateCurrentUserProfile}
          onClose={() => setShowUserProfile(false)}
          isDarkMode={isDarkMode}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default FleetManagement;
