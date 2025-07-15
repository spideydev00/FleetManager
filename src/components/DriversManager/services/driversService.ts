import { supabase } from "../../../supabase";
import { Driver, Attachment } from "../../../types";
import { generateUUID } from "../../../utils/generateUuid";

export interface DriversServiceInterface {
  fetchDrivers(): Promise<{ data: Driver[] | null; error: any }>;
  fetchDriverById(id: string): Promise<{ data: Driver | null; error: any }>;
  createDriver(
    driver: Partial<Driver>
  ): Promise<{ data: Driver | null; error: any }>;
  updateDriver(
    id: string,
    driver: Partial<Driver>
  ): Promise<{ data: Driver | null; error: any }>;
  deleteDriver(id: string): Promise<{ error: any }>;
  deleteMultipleDrivers(ids: string[]): Promise<{ error: any }>;
  importDriversFromExcel(
    drivers: any[]
  ): Promise<{ data: Driver[] | null; error: any }>;
  exportDriversToExcel(
    drivers: Driver[]
  ): Promise<{ success: boolean; error: any }>;
  uploadAttachment(
    driverId: string,
    file: File
  ): Promise<{ data: Attachment | null; error: any }>;
  deleteAttachment(attachmentId: string): Promise<{ error: any }>;
}

class DriversService implements DriversServiceInterface {
  async exportDriversToExcel(drivers: Driver[]): Promise<{ success: boolean; error: any }> {
    try {
      const XLSX = await import("xlsx");

      const worksheetData = drivers.map((driver) => ({
        id: driver.id,
        nome_driver: driver.nomeDriver,
        centro_costo: driver.centroCosto,
        societa: driver.societa,
        noleggiatore: driver.noleggiatore,
        marca: driver.marca,
        modello: driver.modello,
        targa: driver.targa,
        alimentazione: driver.alimentazione,
        emissioni: driver.emissioni,
        inizio_contratto: driver.inizioContratto,
        scadenza_contratto: driver.scadenzaContratto,
        canone_mensile: driver.canoneMensile,
        km_contrattuali: driver.kmContrattuali,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");

      XLSX.writeFile(workbook, "drivers_export.xlsx");

      return { success: true, error: null };
    } catch (error) {
      console.error("Error exporting drivers to Excel:", error);
      return { success: false, error };
    }
  }

  async fetchDrivers() {
    try {
      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select("*");

      if (driversError) throw driversError;

      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("*");

      if (attachmentsError) throw attachmentsError;

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
        const formattedDrivers = driversData.map((d) => ({
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

        return { data: formattedDrivers, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching drivers:", error);
      return { data: null, error };
    }
  }

  async fetchDriverById(id: string) {
    try {
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .single();

      if (driverError) throw driverError;

      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("*")
        .eq("driver_id", id);

      if (attachmentsError) throw attachmentsError;

      const attachments = attachmentsData
        ? attachmentsData.map((att) => ({
            id: att.id,
            driverId: att.driver_id,
            nome: att.nome,
            tipo: att.tipo,
            dimensione: att.dimensione,
            dataCaricamento: att.data_caricamento || new Date().toISOString(),
            url: att.url,
          }))
        : [];

      const driver = {
        id: driverData.id,
        nomeDriver: driverData.nome_driver,
        centroCosto: driverData.centro_costo,
        societa: driverData.societa,
        noleggiatore: driverData.noleggiatore,
        marca: driverData.marca,
        modello: driverData.modello,
        targa: driverData.targa,
        alimentazione: driverData.alimentazione,
        emissioni: driverData.emissioni,
        inizioContratto: driverData.inizio_contratto,
        scadenzaContratto: driverData.scadenza_contratto,
        canoneMensile: driverData.canone_mensile,
        kmContrattuali: driverData.km_contrattuali,
        allegati: attachments,
      };

      return { data: driver, error: null };
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      return { data: null, error };
    }
  }

  async createDriver(driver: Partial<Driver>) {
    try {
      const payload = {
        nome_driver: driver.nomeDriver,
        centro_costo: driver.centroCosto || "",
        societa: driver.societa || "",
        noleggiatore: driver.noleggiatore || "",
        marca: driver.marca || "",
        modello: driver.modello || "",
        targa: driver.targa || "",
        alimentazione: driver.alimentazione || "",
        emissioni: driver.emissioni || "",
        inizio_contratto: driver.inizioContratto || null,
        scadenza_contratto: driver.scadenzaContratto || null,
        canone_mensile: driver.canoneMensile || 0,
        km_contrattuali: driver.kmContrattuali || 0,
      };

      const { data, error } = await supabase
        .from("drivers")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data?.length) {
        const d = data[0];
        const inserted: Driver = {
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
          canoneMensile: d.canone_mensile,
          kmContrattuali: d.km_contrattuali,
        };

        return { data: inserted, error: null };
      }

      return { data: null, error: new Error("No data returned from insert") };
    } catch (error) {
      console.error("Error creating driver:", error);
      return { data: null, error };
    }
  }

  async updateDriver(id: string, driver: Partial<Driver>) {
    try {
      const cm =
        typeof driver.canoneMensile === "string"
          ? parseFloat(driver.canoneMensile)
          : driver.canoneMensile || 0;

      const kmc =
        typeof driver.kmContrattuali === "string"
          ? parseInt(driver.kmContrattuali)
          : driver.kmContrattuali || 0;

      const { data, error } = await supabase
        .from("drivers")
        .update({
          nome_driver: driver.nomeDriver,
          centro_costo: driver.centroCosto,
          societa: driver.societa,
          noleggiatore: driver.noleggiatore,
          marca: driver.marca,
          modello: driver.modello,
          targa: driver.targa,
          alimentazione: driver.alimentazione,
          emissioni: driver.emissioni,
          inizio_contratto: driver.inizioContratto,
          scadenza_contratto: driver.scadenzaContratto,
          canone_mensile: cm,
          km_contrattuali: kmc,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data?.length) {
        const d = data[0];
        const updated: Driver = {
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
          canoneMensile: d.canone_mensile,
          kmContrattuali: d.km_contrattuali,
        };

        return { data: updated, error: null };
      }

      return { data: null, error: new Error("No data returned from update") };
    } catch (error) {
      console.error("Error updating driver:", error);
      return { data: null, error };
    }
  }

  async deleteDriver(id: string) {
    try {
      const { error } = await supabase.from("drivers").delete().eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting driver:", error);
      return { error };
    }
  }

  async deleteMultipleDrivers(ids: string[]) {
    try {
      const { error } = await supabase.from("drivers").delete().in("id", ids);

      return { error };
    } catch (error) {
      console.error("Error deleting multiple drivers:", error);
      return { error };
    }
  }

  async uploadAttachment(driverId: string, file: File) {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `driver-${driverId}/${timestamp}_${sanitizedFileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from("driver-documents")
        .createSignedUrl(fileName, 31536000); // 1 year

      if (urlError) throw urlError;

      const { data, error } = await supabase
        .from("attachments")
        .insert([
          {
            driver_id: driverId,
            nome: file.name,
            tipo: file.type,
            dimensione: file.size,
            url: signedUrlData.signedUrl,
            data_caricamento: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const attachment: Attachment = {
        id: data.id,
        driverId: data.driver_id,
        nome: data.nome,
        tipo: data.tipo,
        dimensione: data.dimensione,
        dataCaricamento: data.data_caricamento,
        url: data.url,
      };

      return { data: attachment, error: null };
    } catch (error) {
      console.error("Error uploading attachment:", error);
      return { data: null, error };
    }
  }

  async deleteAttachment(attachmentId: string) {
    try {
      const { data: attachment, error: fetchError } = await supabase
        .from("attachments")
        .select("*")
        .eq("id", attachmentId)
        .single();

      if (fetchError) throw fetchError;

      let filePath = '';
      if (attachment.url) {
        try {
          const urlParts = attachment.url.split('/');
          const fileName = urlParts[urlParts.length - 1].split('?')[0];
          const driverIdMatch = attachment.driver_id;
          
          if (driverIdMatch) {
            filePath = `driver-${driverIdMatch}/${attachment.nome}`;
          }
        } catch (e) {
          console.warn("Could not extract file path, using alternative method");
          filePath = attachment.nome;
        }
      }

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("driver-documents")
          .remove([filePath]);

        if (storageError) {
          console.warn("Error deleting file from storage:", storageError);
        }
      }

      const { error } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachmentId);

      return { error };
    } catch (error) {
      console.error("Error deleting attachment:", error);
      return { error };
    }
  }

  async importDriversFromExcel(driversData: any[]) {
    try {
      console.log("Service: Starting import with data:", driversData);

      // First, delete ALL existing drivers
      const { error: deleteError } = await supabase
        .from("drivers")
        .delete()
        .gte("inizio_contratto", "1900-01-01");

      if (deleteError) {
        console.error("Error deleting existing drivers:", deleteError);
        throw deleteError;
      }

      // Generate UUIDs for drivers without IDs and format data
      const processedDrivers = driversData.map(drv => {
        const formatDate = (dt: Date | string | null): string | null => {
          if (!dt) return null;
          
          try {
            let date: Date;
            
            if (dt instanceof Date) {
              date = dt;
            } else if (typeof dt === "string") {
              date = new Date(dt);
              
              if (isNaN(date.getTime()) && dt.includes("/")) {
                const parts = dt.split("/");
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                }
              }
            } else {
              date = new Date(dt);
            }

            if (isNaN(date.getTime())) return null;
            
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${dd}`;
          } catch (e) {
            console.warn("Error formatting date:", dt, e);
            return null;
          }
        };

        return {
          id: drv.id || generateUUID(),
          nome_driver: drv.nomeDriver || "",
          centro_costo: drv.centroCosto || "",
          societa: drv.societa || "",
          noleggiatore: drv.noleggiatore || "",
          marca: drv.marca || "",
          modello: drv.modello || "",
          targa: drv.targa || "",
          alimentazione: drv.alimentazione || "",
          emissioni: drv.emissioni || "",
          inizio_contratto: formatDate(drv.inizioContratto),
          scadenza_contratto: formatDate(drv.scadenzaContratto),
          canone_mensile: Number(drv.canoneMensile) || 0,
          km_contrattuali: Number(drv.kmContrattuali) || 0,
        };
      });

      console.log("Service: Processed drivers for insertion:", processedDrivers);

      const batchSize = 20;
      for (let i = 0; i < processedDrivers.length; i += batchSize) {
        const batch = processedDrivers.slice(i, i + batchSize);
        
        console.log(`Service: Inserting batch ${Math.floor(i / batchSize) + 1}:`, batch);
        
        const { error: insertError } = await supabase
          .from("drivers")
          .insert(batch);

        if (insertError) {
          console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError);
          throw insertError;
        }
      }

      console.log("Service: All batches inserted successfully, fetching updated drivers");

      return await this.fetchDrivers();
    } catch (error) {
      console.error("Service: Error importing drivers:", error);
      return { data: null, error };
    }
  }
}

export const driversService = new DriversService();