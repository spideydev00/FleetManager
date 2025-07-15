import { useState, useEffect } from "react";
import { Driver, Order, FuelCard } from "../../../entities/types";
import { dashboardService } from "../services/dashboardService";

export const useDashboard = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [driversResult, ordersResult, fuelCardsResult] = await Promise.all([
        dashboardService.fetchDrivers(),
        dashboardService.fetchOrders(),
        dashboardService.fetchFuelCards(),
      ]);

      if (driversResult.error) throw driversResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (fuelCardsResult.error) throw fuelCardsResult.error;

      setDrivers(driversResult.data || []);
      setOrders(ordersResult.data || []);
      setFuelCards(fuelCardsResult.data || []);
    } catch (err: any) {
      setError(err.message || "Errore durante il caricamento dei dati");
    } finally {
      setIsLoading(false);
    }
  };

  const getExpiringContracts = async (months: number = 6) => {
    try {
      setIsLoading(true);
      const { data, error } = await dashboardService.getExpiringContracts(
        months
      );
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(
        err.message || "Errore nel caricamento dei contratti in scadenza"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (drivers: Driver[]) => {
    try {
      setIsLoading(true);
      const { success, error } = await dashboardService.exportDashboardData(
        drivers
      );
      if (error) throw error;
      return success;
    } catch (err: any) {
      setError(err.message || "Errore durante l'esportazione");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await dashboardService.getRealtimeStats();
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(
        err.message || "Errore durante l'aggiornamento delle statistiche"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from current data
  const stats = dashboardService.calculateStats(drivers, orders, fuelCards);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    drivers,
    orders,
    fuelCards,
    stats,
    isLoading,
    error,
    refreshData: fetchData,
    refreshStats,
    getExpiringContracts,
    exportData,
  };
};
