import { supabase } from "../../../supabase/supabase";
import { Order, OrderToMake, Driver } from "../../../entities/types";
import { generateUUID } from "../../../utils/generateUuid";

export interface OrdersServiceInterface {
  fetchOrders(): Promise<{ data: Order[] | null; error: any }>;
  fetchOrdersToMake(): Promise<{ data: OrderToMake[] | null; error: any }>;
  createOrder(
    order: Partial<Order>
  ): Promise<{ data: Order | null; error: any }>;
  createOrderToMake(
    order: Partial<OrderToMake>
  ): Promise<{ data: OrderToMake | null; error: any }>;
  updateOrder(
    id: string,
    order: Partial<Order>
  ): Promise<{ data: Order | null; error: any }>;
  updateOrderToMake(
    id: string,
    order: Partial<OrderToMake>
  ): Promise<{ data: OrderToMake | null; error: any }>;
  deleteOrder(id: string): Promise<{ error: any }>;
  deleteOrderToMake(id: string): Promise<{ error: any }>;
  deleteMultipleOrders(ids: string[]): Promise<{ error: any }>;
  deleteMultipleOrdersToMake(ids: string[]): Promise<{ error: any }>;
  importOrdersFromExcel(
    orders: any[]
  ): Promise<{ data: Order[] | null; error: any }>;
  exportOrdersToExcel(
    orders: Order[]
  ): Promise<{ success: boolean; error: any }>;
  generateOrderCode(): Promise<string>;
  updateDriverData(driverId: string, driverData: any): Promise<{ error: any }>;
  // Additional methods
  fetchDrivers(): Promise<{ data: Driver[] | null; error: any }>;
}

class OrdersService implements OrdersServiceInterface {
  async fetchOrders() {
    try {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) throw error;

      if (data) {
        return {
          data: data.map((order) => ({
            id: order.id,
            ordine: order.ordine,
            nome_driver: order.nome_driver,
            marca: order.marca,
            modello: order.modello,
            fornitore: order.fornitore,
            data_ordine: order.data_ordine,
            consegnata: Boolean(order.consegnata),
            driver_id: order.driver_id,
          })),
          error: null,
        };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { data: null, error };
    }
  }

  async fetchOrdersToMake() {
    try {
      const { data, error } = await supabase.from("orders_to_make").select("*");

      if (error) throw error;

      if (data) {
        return {
          data: data.map((orderToMake) => ({
            id: orderToMake.id,
            nome_driver: orderToMake.nome_driver,
            scelta_auto: orderToMake.scelta_auto,
            rda: orderToMake.rda,
            offerte: orderToMake.offerte,
            verifica: orderToMake.verifica,
            firme: orderToMake.firme,
            stato: orderToMake.stato || "Non iniziata",
            driver_id: orderToMake.driver_id,
          })),
          error: null,
        };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error fetching orders to make:", error);
      return { data: null, error };
    }
  }

  async createOrder(order: Partial<Order>) {
    try {
      // Generate order code if not provided
      let orderCode = order.ordine;
      if (!orderCode) {
        orderCode = await this.generateOrderCode();
      }

      const orderToAdd = {
        ordine: orderCode,
        nome_driver: order.nome_driver,
        marca: order.marca,
        modello: order.modello,
        fornitore: order.fornitore,
        data_ordine:
          order.data_ordine || new Date().toISOString().split("T")[0],
        consegnata: order.consegnata || false,
        driver_id: order.driver_id || null,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderToAdd])
        .select();

      if (error) throw error;

      if (data?.length) {
        return { data: data[0], error: null };
      }

      return { data: null, error: new Error("No data returned from insert") };
    } catch (error) {
      console.error("Error creating order:", error);
      return { data: null, error };
    }
  }

  async createOrderToMake(order: Partial<OrderToMake>) {
    try {
      const orderToMakeToAdd = {
        nome_driver: order.nome_driver,
        scelta_auto: order.scelta_auto || "Non iniziata",
        rda: order.rda || "Non iniziata",
        offerte: order.offerte || "Non iniziata",
        verifica: order.verifica || "Non iniziata",
        stato: order.stato || "Non iniziata",
        driver_id: order.driver_id || null,
        firme: order.firme || "Non iniziata",
      };

      const { data, error } = await supabase
        .from("orders_to_make")
        .insert([orderToMakeToAdd])
        .select();

      if (error) throw error;

      if (data?.length) {
        return { data: data[0], error: null };
      }

      return { data: null, error: new Error("No data returned from insert") };
    } catch (error) {
      console.error("Error creating order to make:", error);
      return { data: null, error };
    }
  }

  async updateOrder(id: string, order: Partial<Order>) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          ordine: order.ordine,
          nome_driver: order.nome_driver,
          marca: order.marca,
          modello: order.modello,
          fornitore: order.fornitore,
          data_ordine: order.data_ordine,
          consegnata: order.consegnata,
          driver_id: order.driver_id,
        })
        .eq("id", id);

      if (error) throw error;

      return { data: order as Order, error: null };
    } catch (error) {
      console.error("Error updating order:", error);
      return { data: null, error };
    }
  }

  async updateOrderToMake(id: string, order: Partial<OrderToMake>) {
    try {
      const { error } = await supabase
        .from("orders_to_make")
        .update({
          nome_driver: order.nome_driver,
          scelta_auto: order.scelta_auto,
          rda: order.rda,
          offerte: order.offerte,
          verifica: order.verifica,
          firme: order.firme,
          driver_id: order.driver_id,
          stato: order.stato,
        })
        .eq("id", id);

      if (error) throw error;

      return { data: order as OrderToMake, error: null };
    } catch (error) {
      console.error("Error updating order to make:", error);
      return { data: null, error };
    }
  }

  async deleteOrder(id: string) {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting order:", error);
      return { error };
    }
  }

  async deleteOrderToMake(id: string) {
    try {
      const { error } = await supabase
        .from("orders_to_make")
        .delete()
        .eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting order to make:", error);
      return { error };
    }
  }

  async deleteMultipleOrders(ids: string[]) {
    try {
      const { error } = await supabase.from("orders").delete().in("id", ids);

      return { error };
    } catch (error) {
      console.error("Error deleting multiple orders:", error);
      return { error };
    }
  }

  async deleteMultipleOrdersToMake(ids: string[]) {
    try {
      const { error } = await supabase
        .from("orders_to_make")
        .delete()
        .in("id", ids);

      return { error };
    } catch (error) {
      console.error("Error deleting multiple orders to make:", error);
      return { error };
    }
  }

  async importOrdersFromExcel(orders: any[]) {
    try {
      // Get existing orders to delete them
      const { data: existingOrders } = await supabase
        .from("orders")
        .select("id");

      // Delete existing orders
      if (existingOrders && existingOrders.length > 0) {
        const existingIds = existingOrders.map((order) => order.id);
        const { error: deleteError } = await supabase
          .from("orders")
          .delete()
          .in("id", existingIds);

        if (deleteError) throw deleteError;
      }

      // Prepare orders for insertion
      const ordersToInsert = orders.map((order) => ({
        id: order.id || generateUUID(),
        ordine: order.ordine || "",
        nome_driver: order.nome_driver || "",
        driver_id: order.driver_id || null,
        marca: order.marca || "",
        modello: order.modello || "",
        fornitore: order.fornitore || "",
        data_ordine: order.data_ordine || new Date().toISOString().split("T")[0],
        consegnata: order.consegnata || false,
      }));

      // Insert new orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(ordersToInsert)
        .select();

      if (orderError) throw orderError;

      if (orderData) {
        return { data: orderData, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error("Error importing orders:", error);
      return { data: null, error };
    }
  }

  async exportOrdersToExcel(orders: Order[]) {
    try {
      const XLSX = await import("xlsx");

      // Prepare data for export
      const exportData = orders.map((order) => ({
        id: order.id,
        ordine: order.ordine,
        nome_driver: order.nome_driver,
        driver_id: order.driver_id || "",
        marca: order.marca,
        modello: order.modello,
        fornitore: order.fornitore,
        data_ordine: order.data_ordine,
        consegnata: order.consegnata,
      }));

      // Create Excel workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ordini");

      // Generate file and download
      const fileName = "ordini_in_corso.xlsx";
      XLSX.writeFile(wb, fileName);

      return { success: true, error: null };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, error };
    }
  }

  async generateOrderCode() {
    try {
      // Get current year
      const currentYear = new Date().getFullYear();

      // Get the latest order for the current year
      const { data, error } = await supabase
        .from("orders")
        .select("ordine")
        .like("ordine", `ORD-${currentYear}-%`)
        .order("ordine", { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;

      if (data && data.length > 0) {
        // Extract the index from the latest order
        const lastOrder = data[0].ordine;
        const lastIndex = parseInt(lastOrder.split("-")[2]);
        nextNumber = isNaN(lastIndex) ? 1 : lastIndex + 1;
      }

      // Format with leading zeros (e.g., 001, 010, 100)
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      return `ORD-${currentYear}-${formattedNumber}`;
    } catch (error) {
      // Fallback with timestamp to ensure uniqueness
      const currentYear = new Date().getFullYear();
      return `ORD-${currentYear}-${Date.now().toString().slice(-3)}`;
    }
  }

  async updateDriverData(driverId: string, driverData: any) {
    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          nome_driver: driverData.nomeDriver,
          centro_costo: driverData.centroCosto,
          societa: driverData.societa,
          noleggiatore: driverData.noleggiatore,
          marca: driverData.marca,
          modello: driverData.modello,
          targa: driverData.targa,
          alimentazione: driverData.alimentazione,
          emissioni: driverData.emissioni,
          inizio_contratto: driverData.inizioContratto,
          scadenza_contratto: driverData.scadenzaContratto,
          canone_mensile: driverData.canoneMensile,
          km_contrattuali: driverData.kmContrattuali,
        })
        .eq("id", driverId);

      return { error };
    } catch (error) {
      console.error("Error updating driver data:", error);
      return { error };
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

export const ordersService = new OrdersService();
