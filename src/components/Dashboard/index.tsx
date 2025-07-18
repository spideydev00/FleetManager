import React, { useState, useEffect } from "react";
import { Driver, Order, FuelCard, User } from "../../entities/types";
import DashboardStats from "./components/DashboardStats";
import DriversTable from "./components/DriversTable";

interface DashboardProps {
  drivers: Driver[];
  orders: Order[];
  fuelCards: FuelCard[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode: boolean;
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  drivers,
  orders,
  fuelCards,
  searchTerm,
  setSearchTerm,
  isDarkMode,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.nomeDriver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.targa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.societa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // IMPORTANTE: Rimuovo la limitazione a 10 driver
  // Qui probabilmente c'è qualcosa come:
  // const displayDrivers = filteredDrivers.slice(0, 10);
  // o
  // const topDrivers = drivers.slice(0, 10);

  // Modifica: passa TUTTI i driver filtrati alla tabella, senza limitazioni
  const displayDrivers = filteredDrivers;

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <DashboardStats
        drivers={drivers}
        orders={orders}
        fuelCards={fuelCards}
        isDarkMode={isDarkMode}
        isLoading={isLoading}
      />

      {/* Dashboard Drivers Table */}
      <DriversTable
        drivers={displayDrivers}
        isDarkMode={isDarkMode}
        compact={true}
        height="500px"
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
