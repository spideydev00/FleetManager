import { supabase } from "../../../supabase/supabase";
import { Driver, Order, FuelCard } from "../../../entities/types";

export interface DashboardServiceInterface {
  calculateStats(
    drivers: Driver[],
    orders: Order[],
    fuelCards: FuelCard[]
  ): any;
  getExpiringContracts(
    months: number
  ): Promise<{ data: Driver[] | null; error: any }>;
  getFilteredDrivers(
    filters: any
  ): Promise<{ data: Driver[] | null; error: any }>;
  exportDashboardData(
    drivers: Driver[]
  ): Promise<{ success: boolean; error?: any }>;
  getRealtimeStats(): Promise<{ data: any; error: any }>;
  // Additional data fetching methods
  fetchDrivers(): Promise<{ data: Driver[] | null; error: any }>;
  fetchOrders(): Promise<{ data: Order[] | null; error: any }>;
  fetchFuelCards(): Promise<{ data: FuelCard[] | null; error: any }>;
}

class DashboardService implements DashboardServiceInterface {
  calculateStats(drivers: Driver[], orders: Order[], fuelCards: FuelCard[]) {
    const totalVehicles = drivers.length;
    const pendingOrders = orders.filter(
      (order) => order.consegnata === false
    ).length;
    const pendingFuelCards = fuelCards.filter(
      (card) => card.stato === "Non arrivata" || card.stato === "In attesa"
    ).length;

    // Calculate contracts expiring in the next 6 months
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    const expiringVehicles = drivers.filter((driver) => {
      if (!driver.scadenzaContratto) return false;
      const expiryDate = new Date(driver.scadenzaContratto);
      return expiryDate >= today && expiryDate <= sixMonthsFromNow;
    }).length;

    // Calculate total monthly fee
    const totalMonthlyFee = drivers.reduce((sum, driver) => {
      const canoneMensile =
        typeof driver.canoneMensile === "number" ? driver.canoneMensile : 0;
      return sum + canoneMensile;
    }, 0);

    // Calculate average contract km
    const averageContractKm = drivers.length
      ? Math.round(
          drivers.reduce((sum, driver) => {
            const kmContrattuali =
              typeof driver.kmContrattuali === "number"
                ? driver.kmContrattuali
                : 0;
            return sum + kmContrattuali;
          }, 0) / drivers.length
        )
      : 0;

    // Count by fuel type
    const fuelTypes = drivers.reduce((acc, driver) => {
      const type = driver.alimentazione || "Non specificato";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find most common fuel type
    let mostCommonFuelType = "Nessuno";
    let maxCount = 0;

    Object.entries(fuelTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        mostCommonFuelType = type;
        maxCount = count;
      }
    });

    return {
      totalVehicles,
      pendingOrders,
      pendingFuelCards,
      expiringVehicles,
      totalMonthlyFee,
      averageContractKm,
      fuelTypes,
      mostCommonFuelType,
      maxCount,
      avgMonthlyFee: totalMonthlyFee / (drivers.length || 1),
    };
  }

  async getExpiringContracts(months: number = 6) {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setMonth(today.getMonth() + months);

      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .gte("scadenza_contratto", today.toISOString())
        .lte("scadenza_contratto", futureDate.toISOString());

      if (error) throw error;

      // Transform data to match frontend format
      const transformedData =
        data?.map((d) => ({
          id: d.id,
          nomeDriver: d.nome_driver,
          centroCosto: d.centro_costo,
          societa: d.societa,
          noleggiatore: d.noleggiatore,
          marca: d.marca,
          modello: d.modello,
          targa: d.targa,
          alimentazione: d.alimentazione,
          emissioni: d.emissioni,
          inizioContratto: d.inizio_contratto,
          scadenzaContratto: d.scadenza_contratto,
          canoneMensile: d.canone_mensile || 0,
          kmContrattuali: d.km_contrattuali || 0,
        })) || [];

      return { data: transformedData, error: null };
    } catch (error) {
      console.error("Error fetching expiring contracts:", error);
      return { data: null, error };
    }
  }

  async getFilteredDrivers(filters: any) {
    try {
      let query = supabase.from("drivers").select("*");

      // Apply filters
      if (filters.societa) {
        query = query.eq("societa", filters.societa);
      }
      if (filters.noleggiatore) {
        query = query.eq("noleggiatore", filters.noleggiatore);
      }
      if (filters.alimentazione) {
        query = query.eq("alimentazione", filters.alimentazione);
      }
      if (filters.expiring) {
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);
        query = query
          .gte("scadenza_contratto", today.toISOString())
          .lte("scadenza_contratto", sixMonthsFromNow.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match frontend format
      const transformedData =
        data?.map((d) => ({
          id: d.id,
          nomeDriver: d.nome_driver,
          centroCosto: d.centro_costo,
          societa: d.societa,
          noleggiatore: d.noleggiatore,
          marca: d.marca,
          modello: d.modello,
          targa: d.targa,
          alimentazione: d.alimentazione,
          emissioni: d.emissioni,
          inizioContratto: d.inizio_contratto,
          scadenzaContratto: d.scadenza_contratto,
          canoneMensile: d.canone_mensile || 0,
          kmContrattuali: d.km_contrattuali || 0,
        })) || [];

      return { data: transformedData, error: null };
    } catch (error) {
      console.error("Error fetching filtered drivers:", error);
      return { data: null, error };
    }
  }

  async exportDashboardData(drivers: Driver[]) {
    try {
      // FIX: Use correct dynamic import for xlsx (no destructuring)
      const XLSX = await import("xlsx");

      const dataToExport = drivers.map((driver) => ({
        id: driver.id || "",
        nome_driver: driver.nomeDriver || "",
        societa: driver.societa || "",
        centro_costo: driver.centroCosto || "",
        noleggiatore: driver.noleggiatore || "",
        marca: driver.marca || "",
        modello: driver.modello || "",
        targa: driver.targa || "",
        alimentazione: driver.alimentazione || "",
        emissioni: driver.emissioni || "",
        inizio_contratto: driver.inizioContratto
          ? new Date(driver.inizioContratto).toLocaleDateString("it-IT")
          : "",
        scadenza_contratto: driver.scadenzaContratto
          ? new Date(driver.scadenzaContratto).toLocaleDateString("it-IT")
          : "",
        canone_mensile: driver.canoneMensile || 0,
        km_contrattuali: driver.kmContrattuali || 0,
      }));

      // Use XLSX.utils directly (not XLSX.default.utils)
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(wb, ws, "Dashboard Export");

      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      XLSX.writeFile(wb, `Dashboard_Export_${formattedDate}.xlsx`);

      return { success: true };
    } catch (error) {
      console.error("Error exporting dashboard data:", error);
      return { success: false, error };
    }
  }

  async getRealtimeStats() {
    try {
      // Fetch latest counts from database
      const [driversResult, ordersResult, fuelCardsResult] = await Promise.all([
        supabase.from("drivers").select("*", { count: "exact" }),
        supabase.from("orders").select("*", { count: "exact" }),
        supabase.from("fuel_cards").select("*", { count: "exact" }),
      ]);

      if (driversResult.error || ordersResult.error || fuelCardsResult.error) {
        throw new Error("Error fetching realtime stats");
      }

      const stats = {
        totalDrivers: driversResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalFuelCards: fuelCardsResult.count || 0,
        lastUpdated: new Date().toISOString(),
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error fetching realtime stats:", error);
      return { data: null, error };
    }
  }

  async fetchDrivers() {
    try {
      // First, fetch all drivers
      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select("*");

      if (driversError) throw driversError;

      // Then, fetch all attachments to avoid multiple queries
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("*");

      if (attachmentsError) throw attachmentsError;

      // Group attachments by driver_id
      const attachmentsByDriver: Record<string, any[]> = {};

      if (attachmentsData) {
        attachmentsData.forEach((attachment) => {
          const driverId = attachment.driver_id;
          if (!attachmentsByDriver[driverId]) {
            attachmentsByDriver[driverId] = [];
          }
          attachmentsByDriver[driverId].push({
            id: attachment.id,
            driverId: attachment.driver_id,
            nome: attachment.nome,
            tipo: attachment.tipo,
            dimensione: attachment.dimensione,
            dataCaricamento:
              attachment.data_caricamento,
            url: attachment.url,
          });
        });
      }

      if (driversData) {
        const drivers = driversData.map((d) => ({
          id: d.id,
          nomeDriver: d.nome_driver,
          centroCosto: d.centro_costo,
          societa: d.societa,
          noleggiatore: d.noleggiatore,
          marca: d.marca,
          modello: d.modello,
          targa: d.targa,
          alimentazione: d.alimentazione,
          emissioni: d.emissioni,
          inizioContratto: d.inizio_contratto,
          scadenzaContratto: d.scadenza_contratto,
          canoneMensile: d.canone_mensile || 0,
          kmContrattuali: d.km_contrattuali || 0,
          allegati: attachmentsByDriver[d.id] || [],
        }));

        return { data: drivers, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching drivers:", error);
      return { data: null, error };
    }
  }

  async fetchOrders() {
    try {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) throw error;

      if (data) {
        const orders = data.map((order) => ({
          id: order.id,
          ordine: order.ordine,
          nome_driver: order.nome_driver,
          marca: order.marca,
          modello: order.modello,
          fornitore: order.fornitore,
          data_ordine: order.data_ordine,
          consegnata: Boolean(order.consegnata),
          driver_id: order.driver_id,
        }));

        return { data: orders, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { data: null, error };
    }
  }

  async fetchFuelCards() {
    try {
      const { data, error } = await supabase.from("fuel_cards").select("*");

      if (error) throw error;

      if (data) {
        const fuelCards = data.map((fc) => ({
          id: fc.id,
          targa: fc.targa,
          nome_driver: fc.nome_driver,
          societa: fc.societa,
          driver_id: fc.driver_id,
          stato: fc.stato || "Non arrivata",
          referente: fc.referente,
          dataRichiesta: fc.data_richiesta,
          alimentazione: fc.alimentazione,
        }));

        return { data: fuelCards, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching fuel cards:", error);
      return { data: null, error };
    }
  }
}

export const dashboardService = new DashboardService();
