import { supabase } from "../../../supabase/supabase";
import { Driver, Order, FuelCard } from "../../../entities/types";
import { getEmissionsNumericValue } from "../../../utils/getEmissionsAsNumber";

export interface ReportsServiceInterface {
  exportToExcel(
    drivers: Driver[],
    filename?: string
  ): Promise<{ success: boolean; error?: any }>;
  generatePDFReport(
    drivers: Driver[],
    reportType: string
  ): Promise<{ success: boolean; error?: any }>;
  calculateFleetStatistics(drivers: Driver[]): any;
  generateChartData(drivers: Driver[]): any;
  parseEmissions(emissionsString: string | number | undefined): number;
  // Additional data fetching methods
  fetchDrivers(): Promise<{ data: Driver[] | null; error: any }>;
  fetchOrders(): Promise<{ data: Order[] | null; error: any }>;
  fetchFuelCards(): Promise<{ data: FuelCard[] | null; error: any }>;
}

class ReportsService implements ReportsServiceInterface {
  // Parse emissions from string format (e.g., "16g/km")
  parseEmissions(emissionsString: string | number | undefined): number {
    if (!emissionsString) return 0;

    // Use the existing utility function to get numeric value
    const numericValue = getEmissionsNumericValue(emissionsString);

    // Convert to number and return
    const parsed = parseFloat(numericValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  async exportToExcel(drivers: Driver[], filename?: string) {
    try {
      const XLSX = await import("xlsx");

      const dataToExport = drivers.map((drv) => ({
        id: drv.id || "",
        nome_driver: drv.nomeDriver || "",
        societa: drv.societa || "",
        centro_costo: drv.centroCosto || "",
        noleggiatore: drv.noleggiatore || "",
        marca: drv.marca || "",
        modello: drv.modello || "",
        targa: drv.targa || "",
        alimentazione: drv.alimentazione || "",
        emissioni: drv.emissioni || "",
        inizio_contratto: drv.inizioContratto
          ? new Date(drv.inizioContratto).toLocaleDateString("it-IT")
          : "",
        scadenza_contratto: drv.scadenzaContratto
          ? new Date(drv.scadenzaContratto).toLocaleDateString("it-IT")
          : "",
        canone_mensile: drv.canoneMensile || 0,
        km_contrattuali: drv.kmContrattuali || 0,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(wb, ws, "Fleet Report");

      const finalFilename =
        filename ||
        `fleet_report_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, finalFilename);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async generatePDFReport(drivers: Driver[], reportType: string) {
    try {
      // Placeholder for PDF generation logic
      console.log(
        `Generating PDF report of type: ${reportType} for ${drivers.length} drivers`
      );

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  calculateFleetStatistics(drivers: Driver[]) {
    const totalVehicles = drivers.length;
    const brandCount = new Set(drivers.map((d) => d.marca)).size;

    // Enhanced emissions analysis
    const emissionsData = drivers
      .map((d) => {
        const value = this.parseEmissions(d.emissioni);
        return {
          value,
          driver: d,
        };
      })
      .filter((e) => e.value > 0);

    const avgEmissions =
      emissionsData.length > 0
        ? Math.round(
          emissionsData.reduce((a, b) => a + b.value, 0) /
          emissionsData.length
        )
        : 0;
    const minEmissions =
      emissionsData.length > 0
        ? Math.min(...emissionsData.map((e) => e.value))
        : 0;
    const maxEmissions =
      emissionsData.length > 0
        ? Math.max(...emissionsData.map((e) => e.value))
        : 0;

    // Monthly fee analysis
    const feeData = drivers
      .filter((d) => d.canoneMensile)
      .map((d) => d.canoneMensile)
      .filter((f) => !isNaN(f) && f > 0);

    const avgMonthlyFee =
      feeData.length > 0
        ? Math.round(feeData.reduce((a, b) => a + b, 0) / feeData.length)
        : 0;
    const minMonthlyFee = feeData.length > 0 ? Math.min(...feeData) : 0;
    const maxMonthlyFee = feeData.length > 0 ? Math.max(...feeData) : 0;

    // Fuel type distribution
    const fuelTypes = drivers.reduce((acc, driver) => {
      if (driver.alimentazione) {
        acc[driver.alimentazione] = (acc[driver.alimentazione] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Expiring contracts
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    const expiringContracts = drivers.filter((driver) => {
      if (!driver.scadenzaContratto) return false;
      try {
        const expiryDate = new Date(driver.scadenzaContratto);
        if (isNaN(expiryDate.getTime())) return false;
        return expiryDate >= today && expiryDate <= sixMonthsFromNow;
      } catch (error) {
        return false;
      }
    }).length;

    return {
      totalVehicles,
      brandCount,
      avgEmissions,
      minEmissions,
      maxEmissions,
      avgMonthlyFee,
      minMonthlyFee,
      maxMonthlyFee,
      fuelTypes,
      expiringContracts,
    };
  }

  generateChartData(drivers: Driver[]) {
    // Enhanced emissions distribution with new ranges and only real data
    const emissionsWithData = drivers
      .map((d) => {
        const value = this.parseEmissions(d.emissioni);
        return {
          value,
          driver: d,
        };
      })
      .filter((e) => e.value >= 0 && e.driver.emissioni);

    const emissionsDistribution = emissionsWithData.reduce((acc, emission) => {
      let rangeKey: string;

      if (emission.value <= 100) {
        rangeKey = "0-100";
      } else if (emission.value <= 130) {
        rangeKey = "101-130";
      } else if (emission.value <= 160) {
        rangeKey = "131-160";
      } else if (emission.value <= 200) {
        rangeKey = "161-200";
      } else {
        rangeKey = "201+";
      }

      if (!acc[rangeKey]) {
        acc[rangeKey] = 0;
      }
      acc[rangeKey] += 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all ranges are represented
    const allRanges = ["0-100", "101-130", "131-160", "161-200", "201+"];
    const emissionsChartData = allRanges.map(range => ({
      range: `${range} g/km`,
      vehicles: emissionsDistribution[range] || 0,
    }));

    // Monthly fee distribution
    const feeRanges = {
      "0-500": 0,
      "501-750": 0,
      "751-900": 0,
      "901-1150": 0,
      "1151-1600": 0,
      "1601+": 0,
    };

    drivers.forEach((driver) => {
      if (driver.canoneMensile && !isNaN(driver.canoneMensile)) {
        const fee = driver.canoneMensile;
        if (fee <= 500) feeRanges["0-500"]++;
        else if (fee <= 750) feeRanges["501-750"]++;
        else if (fee <= 900) feeRanges["751-900"]++;
        else if (fee <= 1150) feeRanges["901-1150"]++;
        else if (fee <= 1600) feeRanges["1151-1600"]++;
        else feeRanges["1601+"]++;
      }
    });

    const feeChartData = Object.entries(feeRanges).map(([range, count]) => ({
      range: `€${range}`,
      vehicles: count,
    }));

    // Contract expiry by year
    const contractExpiryByYear = drivers
      .filter((d) => d.scadenzaContratto)
      .reduce((acc, driver) => {
        try {
          const expiryDate = new Date(driver.scadenzaContratto!);
          if (!isNaN(expiryDate.getTime())) {
            const year = expiryDate.getFullYear();
            acc[year] = (acc[year] || 0) + 1;
          }
        } catch (error) {
          // Ignore invalid dates
        }
        return acc;
      }, {} as Record<number, number>);

    const contractExpiryChartData = Object.entries(contractExpiryByYear)
      .map(([year, count]) => ({
        year: parseInt(year),
        contracts: count,
      }))
      .sort((a, b) => a.year - b.year);

    // Brand distribution
    const brandDistribution = drivers.reduce((acc, driver) => {
      acc[driver.marca] = (acc[driver.marca] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const brandChartData = Object.entries(brandDistribution)
      .map(([brand, count]) => ({
        brand,
        vehicles: count,
      }))
      .sort((a, b) => b.vehicles - a.vehicles);

    // Pie chart data
    const noleggiatorePieData = Object.entries(
      drivers.reduce((acc, driver) => {
        const noleggiatore = driver.noleggiatore || "Non specificato";
        acc[noleggiatore] = (acc[noleggiatore] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const societaPieData = Object.entries(
      drivers.reduce((acc, driver) => {
        acc[driver.societa] = (acc[driver.societa] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const fuelTypes = drivers.reduce((acc, driver) => {
      if (driver.alimentazione) {
        acc[driver.alimentazione] = (acc[driver.alimentazione] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const alimentazionePieData = Object.entries(fuelTypes).map(
      ([name, value]) => ({ name, value })
    );

    return {
      emissionsChartData,
      feeChartData,
      contractExpiryChartData,
      brandChartData,
      noleggiatorePieData,
      societaPieData,
      alimentazionePieData,
      emissionsWithEstimates: emissionsWithData,
    };
  }

  async fetchDrivers() {
    try {
      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select("*");

      if (driversError) throw driversError;

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
          personale: fc.personale,
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

export const reportsService = new ReportsService();
