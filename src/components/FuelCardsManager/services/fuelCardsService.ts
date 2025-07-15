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
            referente: fc.referente,
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
        referente: fuelCard.referente || "",
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
          referente: fuelCard.referente,
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

  async importFuelCardsFromExcel(fuelCards: any[]) {
    try {
      // Get existing fuel cards to delete them
      const { data: existingFuelCards, error: selectError } = await supabase
        .from("fuel_cards")
        .select("id");

      if (selectError) throw selectError;

      // Delete existing fuel cards
      if (existingFuelCards && existingFuelCards.length > 0) {
        const existingIds = existingFuelCards.map((card) => card.id);
        const { error: deleteError } = await supabase
          .from("fuel_cards")
          .delete()
          .in("id", existingIds);

        if (deleteError) throw deleteError;
      }

      // Prepare fuel cards for insertion
      const fuelCardsToInsert = fuelCards.map((card) => ({
        id: card.id || generateUUID(), // Generate UUID if no ID provided
        targa: card.targa || "",
        nome_driver: card.nome_driver || "",
        societa: card.societa || "",
        data_richiesta: card.data_richiesta || card.dataRichiesta || new Date().toISOString().split("T")[0],
        alimentazione: card.alimentazione || "",
        stato: card.stato || "Non arrivata",
        referente: card.referente || "",
        driver_id: card.driver_id || null,
      }));

      // Insert new fuel cards
      const { data: fuelCardData, error: fuelCardError } = await supabase
        .from("fuel_cards")
        .insert(fuelCardsToInsert)
        .select();

      if (fuelCardError) throw fuelCardError;

      // Map data for frontend
      if (fuelCardData) {
        const mappedData = fuelCardData.map((card) => ({
          ...card,
          dataRichiesta: card.data_richiesta,
        }));
        return { data: mappedData, error: null };
      }

      return { data: [], error: null };
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
        referente: card.referente,
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
