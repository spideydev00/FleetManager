import { supabase } from "../../../supabase/supabase";
import { FuelCard, Driver } from "../../../entities/types";
import { generateUUID } from "../../../utils/generateUuid";

export interface FuelCardsServiceInterface {
  fetchFuelCards(): Promise<{ data: FuelCard[] | null; error: any }>;
  createFuelCard(
    fuelCard: Partial<FuelCard>
  ): Promise<{ data: FuelCard | null; error: any }>;
  updateFuelCard(
    id: string,
    fuelCard: Partial<FuelCard>
  ): Promise<{ data: FuelCard | null; error: any }>;
  deleteFuelCard(id: string): Promise<{ error: any }>;
  deleteMultipleFuelCards(ids: string[]): Promise<{ error: any }>;
  importFuelCardsFromExcel(
    fuelCards: any[]
  ): Promise<{ data: FuelCard[] | null; error: any }>;
  exportFuelCardsToExcel(
    fuelCards: FuelCard[]
  ): Promise<{ success: boolean; error: any }>;
  // Additional methods
  fetchDrivers(): Promise<{ data: Driver[] | null; error: any }>;
}

class FuelCardsService implements FuelCardsServiceInterface {
  async fetchFuelCards() {
    try {
      const { data, error } = await supabase.from("fuel_cards").select("*");

      if (error) throw error;

      if (data) {
        return {
          data: data.map((fc) => ({
            id: fc.id,
            targa: fc.targa,
            nome_driver: fc.nome_driver,
            societa: fc.societa,
            driver_id: fc.driver_id,
            stato: fc.stato || "Non arrivata",
            personale: fc.personale,
            dataRichiesta: fc.data_richiesta,
            alimentazione: fc.alimentazione,
          })),
          error: null,
        };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching fuel cards:", error);
      return { data: null, error };
    }
  }

  async createFuelCard(fuelCard: Partial<FuelCard>) {
    try {
      const fuelCardToAdd = {
        targa: fuelCard.targa || "",
        nome_driver: fuelCard.nome_driver || "",
        societa: fuelCard.societa || "",
        data_richiesta:
          fuelCard.dataRichiesta || new Date().toISOString().split("T")[0],
        alimentazione: fuelCard.alimentazione || "",
        stato: fuelCard.stato || "Non arrivata",
        personale: fuelCard.personale || "",
        driver_id: fuelCard.driver_id,
      };

      const { data, error } = await supabase
        .from("fuel_cards")
        .insert([fuelCardToAdd])
        .select();

      if (error) throw error;

      if (data?.length) {
        const newFuelCard = {
          ...data[0],
          dataRichiesta: data[0].data_richiesta,
        };
        return { data: newFuelCard, error: null };
      }

      return { data: null, error: new Error("No data returned from insert") };
    } catch (error) {
      console.error("Error creating fuel card:", error);
      return { data: null, error };
    }
  }

  async updateFuelCard(id: string, fuelCard: Partial<FuelCard>) {
    try {
      const { error } = await supabase
        .from("fuel_cards")
        .update({
          targa: fuelCard.targa,
          nome_driver: fuelCard.nome_driver,
          societa: fuelCard.societa,
          data_richiesta: fuelCard.dataRichiesta,
          alimentazione: fuelCard.alimentazione,
          stato: fuelCard.stato,
          personale: fuelCard.personale,
          driver_id: fuelCard.driver_id,
        })
        .eq("id", id);

      if (error) throw error;

      return { data: fuelCard as FuelCard, error: null };
    } catch (error) {
      console.error("Error updating fuel card:", error);
      return { data: null, error };
    }
  }

  async deleteFuelCard(id: string) {
    try {
      const { error } = await supabase.from("fuel_cards").delete().eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting fuel card:", error);
      return { error };
    }
  }

  async deleteMultipleFuelCards(ids: string[]) {
    try {
      const { error } = await supabase
        .from("fuel_cards")
        .delete()
        .in("id", ids);

      return { error };
    } catch (error) {
      console.error("Error deleting multiple fuel cards:", error);
      return { error };
    }
  }

  async importFuelCardsFromExcel(fuelCardsData: any[]) {
    try {
      console.log("Service: Starting import with data:", fuelCardsData);

      // First, delete ALL existing fuel cards
      const { error: deleteError } = await supabase
        .from("fuel_cards")
        .delete()
        .gte("data_richiesta", "1900-01-01");

      if (deleteError) {
        console.error("Error deleting existing fuel cards:", deleteError);
        throw deleteError;
      }

      // Format data for insertion
      const processedFuelCards = fuelCardsData.map((card) => {
        // Parse date with support for multiple formats
        const formatDate = (dt: any): string => {
          if (!dt) return new Date().toISOString().split('T')[0];
          
          try {
            // Check if it's a string in dd/mm/yy format
            if (typeof dt === 'string' && /^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dt)) {
              const [day, month, year] = dt.split('/').map(part => parseInt(part, 10));
              // Assume 20xx for years < 50, 19xx for years >= 50
              const fullYear = year < 50 ? 2000 + year : 1900 + year;
              return `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
            
            // Check if it's a string in dd/mm/yyyy format
            if (typeof dt === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dt)) {
              const [day, month, year] = dt.split('/').map(part => parseInt(part, 10));
              return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
            
            // Try standard date parsing
            const date = new Date(dt);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
            
            // Default to current date if parsing fails
            return new Date().toISOString().split('T')[0];
          } catch (e) {
            console.warn("Error formatting date:", dt, e);
            return new Date().toISOString().split('T')[0];
          }
        };

        return {
          id: card.id || generateUUID(),
          targa: card.targa || "",
          nome_driver: card.nome_driver || "",
          societa: card.societa || "",
          driver_id: card.driver_id || null,
          stato: card.stato || "Non arrivata",
          personale: card.personale || "",
          data_richiesta: formatDate(card.dataRichiesta || card.data_richiesta),
          alimentazione: card.alimentazione || "",
        };
      });

      console.log("Service: Processed fuel cards for insertion:", processedFuelCards);

      const { error: insertError } = await supabase
        .from("fuel_cards")
        .insert(processedFuelCards);

      if (insertError) {
        console.error("Error inserting fuel cards:", insertError);
        throw insertError;
      }

      console.log("Service: All batches inserted successfully, fetching updated fuel cards");

      return await this.fetchFuelCards();
    } catch (error) {
      console.error("Error importing fuel cards:", error);
      return { data: null, error };
    }
  }

  async exportFuelCardsToExcel(fuelCards: FuelCard[]) {
    try {
      const XLSX = await import("xlsx");

      const exportData = fuelCards.map((card) => ({
        id: card.id,
        targa: card.targa,
        nome_driver: card.nome_driver,
        societa: card.societa,
        data_richiesta: card.dataRichiesta,
        alimentazione: card.alimentazione, // Use direct value
        stato: card.stato,
        personale: card.personale,
        driver_id: card.driver_id,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "FuelCards");

      const fileName = `fuel_cards_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      return { success: true, error: null };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, error };
    }
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
}

export const fuelCardsService = new FuelCardsService();
