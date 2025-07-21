import React, { useState } from "react";
import { Order, OrderToMake, Driver } from "../../entities/types";
import { ordersService } from "./services/ordersService";
import { generateUUID } from "../../utils/generateUuid";
import OrdersActionBar from "./components/OrdersActionBar";
import OrdersTabs from "./components/OrdersTabs";
import OrdersFilterBar from "./components/OrdersFilterBar";
import OrdersTable from "./components/OrdersTable";
import OrdersToMakeTable from "./components/OrdersToMakeTable";
import OrderForm from "./components/OrderForm";
import OrderToMakeForm from "./components/OrderToMakeForm";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

interface OrdersManagerProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  ordersToMake: OrderToMake[];
  setOrdersToMake: (orders: OrderToMake[]) => void;
  drivers: Driver[];
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  setOrders,
  ordersToMake,
  setOrdersToMake,
  drivers,
  isDarkMode,
  activeTab,
  setActiveTab,
  handleFileUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrdersToMake, setSelectedOrdersToMake] = useState<string[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderToMakeForm, setShowOrderToMakeForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingOrderToMake, setEditingOrderToMake] = useState<OrderToMake | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [operationError, setOperationError] = useState("");

  // Driver search state
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [orderToMakeDriverSearchTerm, setOrderToMakeDriverSearchTerm] = useState("");
  const [driverData, setDriverData] = useState<Partial<Driver> | null>(null);

  // Excel import state (rimuoviamo le variabili per il modal)
  const [showDriverSelectModal, setShowDriverSelectModal] = useState(false);
  const [ambiguousDrivers, setAmbiguousDrivers] = useState<Driver[]>([]);
  const [currentRowForDriverSelect, setCurrentRowForDriverSelect] = useState<any>(null);
  const [importedOrders, setImportedOrders] = useState<any[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  // Utility function for error messages
  const getErrorMessage = (error: any): string => {
    if (!error) return "Errore sconosciuto";
    if (typeof error === "string") return error;
    if (typeof error.message === "string") return error.message;
    return JSON.stringify(error);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.nome_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ordine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.modello.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "Consegnata" && order.consegnata === true) ||
      (statusFilter === "Non consegnata" && order.consegnata === false);
    return matchesSearch && matchesStatus;
  });

  // Filter orders to make
  const filteredOrdersToMake = ordersToMake.filter((order) => {
    return (
      order.nome_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.stato.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Toggle selections
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleOrderToMakeSelection = (orderId: string) => {
    setSelectedOrdersToMake((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Add new order
  const addOrder = async () => {
    if (!editingOrder) return;

    setIsLoading(true);
    setOperationError("");

    try {
      const { data, error } = await ordersService.createOrder(editingOrder);
      if (error) throw error;

      if (data) {
        setOrders([...orders, data]);

        // Update driver data if provided
        if (editingOrder.driver_id && driverData) {
          await ordersService.updateDriverData(
            editingOrder.driver_id,
            driverData
          );
        }

        setEditingOrder(null);
        setShowOrderForm(false);
        setOperationError("Ordine creato con successo!");
        setTimeout(() => setOperationError(""), 3000);
      }
    } catch (error: any) {
      setOperationError(
        `Errore durante l'inserimento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update order
  const updateOrder = async () => {
    if (!editingOrder) return;

    setIsLoading(true);
    setOperationError("");

    try {
      const { error } = await ordersService.updateOrder(
        editingOrder.id,
        editingOrder
      );
      if (error) throw error;

      // Update driver data if provided
      if (editingOrder.driver_id && driverData) {
        await ordersService.updateDriverData(
          editingOrder.driver_id,
          driverData
        );
      }

      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
      setEditingOrder(null);
      setShowOrderForm(false);
      setOperationError("Ordine aggiornato con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (error: any) {
      setOperationError(
        `Errore durante l'aggiornamento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add new order to make
  const addOrderToMake = async () => {
    if (!editingOrderToMake) return;

    setIsLoading(true);
    setOperationError("");

    try {
      const { data, error } = await ordersService.createOrderToMake(
        editingOrderToMake
      );
      if (error) throw error;

      if (data) {
        setOrdersToMake([...ordersToMake, data]);
        setEditingOrderToMake(null);
        setShowOrderToMakeForm(false);
        setOperationError("Ordine da fare creato con successo!");
        setTimeout(() => setOperationError(""), 3000);
      }
    } catch (error: any) {
      setOperationError(
        `Errore durante l'inserimento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update order to make
  const updateOrderToMake = async () => {
    if (!editingOrderToMake) return;

    setIsLoading(true);
    setOperationError("");

    try {
      const { error } = await ordersService.updateOrderToMake(
        editingOrderToMake.id,
        editingOrderToMake
      );
      if (error) throw error;

      setOrdersToMake(
        ordersToMake.map((order) =>
          order.id === editingOrderToMake.id ? editingOrderToMake : order
        )
      );
      setEditingOrderToMake(null);
      setShowOrderToMakeForm(false);
      setOperationError("Ordine da fare aggiornato con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (error: any) {
      setOperationError(
        `Errore durante l'aggiornamento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create order from completed OrderToMake
  const createOrderFromOrderToMake = async (driverId: string) => {
    const selectedDriver = drivers.find((d) => d.id === driverId);
    if (!selectedDriver) return;

    // Generate order code
    const orderCode = await ordersService.generateOrderCode();

    // Create new order with driver data
    const newOrder: Order = {
      id: "",
      ordine: orderCode,
      nome_driver: selectedDriver.nomeDriver,
      marca: selectedDriver.marca || "",
      modello: selectedDriver.modello || "",
      fornitore: selectedDriver.noleggiatore || "",
      data_ordine: new Date().toISOString().split("T")[0],
      consegnata: false,
      driver_id: driverId,
    };

    // Set driver data for the form
    setDriverData(selectedDriver);
    setEditingOrder(newOrder);

    // Close OrderToMake form and open Order form
    setShowOrderToMakeForm(false);
    setShowOrderForm(true);
  };

  // Delete functions
  const deleteOrder = (orderId: string) => {
    setItemToDelete(orderId);
    setDeleteType("order");
    setShowConfirmDelete(true);
  };

  const deleteOrderToMake = (orderId: string) => {
    setItemToDelete(orderId);
    setDeleteType("orderToMake");
    setShowConfirmDelete(true);
  };

  const deleteMultipleOrders = () => {
    if (selectedOrders.length === 0) return;
    setDeleteType("orders");
    setShowConfirmDelete(true);
  };

  const deleteMultipleOrdersToMake = () => {
    if (selectedOrdersToMake.length === 0) return;
    setDeleteType("ordersToMake");
    setShowConfirmDelete(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setIsLoading(true);
    setOperationError("");

    try {
      if (deleteType === "order") {
        const { error } = await ordersService.deleteOrder(itemToDelete!);
        if (error) throw error;
        setOrders(orders.filter((order) => order.id !== itemToDelete));
        setOperationError("Ordine eliminato con successo!");
      } else if (deleteType === "orders") {
        const { error } = await ordersService.deleteMultipleOrders(
          selectedOrders
        );
        if (error) throw error;
        setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
        setSelectedOrders([]);
        setOperationError(
          `${selectedOrders.length} ordini eliminati con successo!`
        );
      } else if (deleteType === "orderToMake") {
        const { error } = await ordersService.deleteOrderToMake(itemToDelete!);
        if (error) throw error;
        setOrdersToMake(
          ordersToMake.filter((order) => order.id !== itemToDelete)
        );
        setOperationError("Ordine da fare eliminato con successo!");
      } else if (deleteType === "ordersToMake") {
        const { error } = await ordersService.deleteMultipleOrdersToMake(
          selectedOrdersToMake
        );
        if (error) throw error;
        setOrdersToMake(
          ordersToMake.filter(
            (order) => !selectedOrdersToMake.includes(order.id)
          )
        );
        setSelectedOrdersToMake([]);
        setOperationError(
          `${selectedOrdersToMake.length} ordini da fare eliminati con successo!`
        );
      }

      setShowConfirmDelete(false);
      setItemToDelete(null);
      setDeleteType("");
      setTimeout(() => setOperationError(""), 3000);
    } catch (error: any) {
      setOperationError(
        `Errore durante l'eliminazione: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = async () => {
    setIsLoading(true);
    setOperationError("");

    try {
      const { success, error } = await ordersService.exportOrdersToExcel(
        orders
      );
      if (error) throw error;

      setOperationError("File Excel esportato con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (error: any) {
      setOperationError(
        `Errore durante l'esportazione: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Import from Excel (enhanced version with marca/modello matching)
  const handleExcelImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingExcel(true);
      setOperationError("");

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = event.target?.result;
            if (!data) return;

            const XLSX = await import("xlsx");
            const wb = XLSX.read(data, { type: "binary" });
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

            // Process the data and match with drivers
            const processedOrders = jsonData.map(orderData => {
              // Try to find driver by name
              let driverMatch = null;
              if (orderData.nome_driver) {
                driverMatch = drivers.find(
                  d => d.nomeDriver.toLowerCase() === orderData.nome_driver.toLowerCase()
                );
              }

              // Use the driver data to populate fields if found
              if (driverMatch) {
                return {
                  ...orderData,
                  driver_id: driverMatch.id,
                  marca: driverMatch.marca || orderData.marca || "",
                  modello: driverMatch.modello || orderData.modello || "",
                  fornitore: driverMatch.noleggiatore || orderData.fornitore || "",
                };
              }
              return orderData;
            });

            const { data: importedData, error } = await ordersService.importOrdersFromExcel(
              processedOrders
            );
            if (error) throw error;

            setOrders(importedData || []);
            setOperationError("Importazione completata con successo!");
            setTimeout(() => setOperationError(""), 3000);
          } catch (error: any) {
            setOperationError(
              `Errore durante l'importazione: ${getErrorMessage(error)}`
            );
          } finally {
            setUploadingExcel(false);
          }
        };
        reader.readAsBinaryString(file);
      } catch (error: any) {
        setOperationError(`Errore durante l'upload: ${getErrorMessage(error)}`);
        setUploadingExcel(false);
      }
    };
    fileInput.click();
  };

  // Cancel driver selection
  const handleCancelDriverSelection = () => {
    setShowDriverSelectModal(false);
    setAmbiguousDrivers([]);
    setCurrentRowForDriverSelect(null);
    setCurrentOrderIndex(0);
    setImportedOrders([]);
    setUploadingExcel(false);
    setOperationError("Importazione annullata");
  };

  // Reset form functions
  const resetOrderForm = () => {
    setEditingOrder(null);
    setDriverData(null);
    setDriverSearchTerm("");
  };

  const resetOrderToMakeForm = () => {
    setEditingOrderToMake(null);
    setOrderToMakeDriverSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <OrdersActionBar
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        selectedOrdersCount={selectedOrders.length}
        selectedOrdersToMakeCount={selectedOrdersToMake.length}
        onAddOrder={() => {
          if (activeTab === "inCorso") {
            setEditingOrder({
              id: "",
              ordine: "",
              nome_driver: "",
              marca: "",
              modello: "",
              fornitore: "",
              data_ordine: new Date().toISOString().split("T")[0],
              consegnata: false,
              driver_id: "",
            });
            setShowOrderForm(true);
          } else {
            setEditingOrderToMake({
              id: "",
              nome_driver: "",
              scelta_auto: "Non iniziata",
              rda: "Non iniziata",
              offerte: "Non iniziata",
              verifica: "Non iniziata",
              firme: "Non iniziata",
              stato: "Non iniziata",
              driver_id: "",
            });
            setShowOrderToMakeForm(true);
          }
        }}
        onImportExcel={handleExcelImport}
        onExportExcel={exportToExcel}
        onDeleteSelectedOrders={deleteMultipleOrders}
        onDeleteSelectedOrdersToMake={deleteMultipleOrdersToMake}
        isLoading={isLoading}
        uploadingExcel={uploadingExcel}
      />

      {/* Tabs */}
      <OrdersTabs
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Filter Bar */}
      <OrdersFilterBar
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredOrdersCount={filteredOrders.length}
        totalOrdersCount={orders.length}
        filteredOrdersToMakeCount={filteredOrdersToMake.length}
        totalOrdersToMakeCount={ordersToMake.length}
      />

      {/* Error Message */}
      {operationError && (
        <div
          className={`p-4 rounded-lg ${operationError.toLowerCase().includes("success") ||
            operationError.toLowerCase().includes("completat")
            ? operationError.toLowerCase().includes("attenzione") || operationError.toLowerCase().includes("corretti")
              ? isDarkMode
                ? "bg-yellow-900 border border-yellow-700"
                : "bg-yellow-100 border border-yellow-300"
              : isDarkMode
                ? "bg-green-900"
                : "bg-green-100"
            : isDarkMode
              ? "bg-red-900"
              : "bg-red-100"
            }`}
        >
          <p
            className={`text-sm whitespace-pre-line ${operationError.toLowerCase().includes("success") ||
              operationError.toLowerCase().includes("completat")
              ? operationError.toLowerCase().includes("attenzione") || operationError.toLowerCase().includes("corretti")
                ? isDarkMode
                  ? "text-yellow-200"
                  : "text-yellow-800"
                : isDarkMode
                  ? "text-green-300"
                  : "text-green-700"
              : isDarkMode
                ? "text-red-300"
                : "text-red-700"
              }`}
          >
            {operationError}
          </p>
        </div>
      )}

      {/* Tables */}
      {activeTab === "inCorso" ? (
        <OrdersTable
          orders={filteredOrders}
          selectedOrders={selectedOrders}
          isDarkMode={isDarkMode}
          onSelectAll={() => {
            const allIds = filteredOrders.map((order) => order.id);
            setSelectedOrders(
              selectedOrders.length === allIds.length ? [] : allIds
            );
          }}
          onSelectOrder={toggleOrderSelection}
          onEditOrder={(order) => {
            setEditingOrder(order);
            if (order.driver_id) {
              const selectedDriver = drivers.find(
                (d) => d.id === order.driver_id
              );
              if (selectedDriver) {
                setDriverData(selectedDriver);
              }
            }
            setShowOrderForm(true);
          }}
          onDeleteOrder={deleteOrder}
        />
      ) : (
        <OrdersToMakeTable
          ordersToMake={filteredOrdersToMake}
          selectedOrdersToMake={selectedOrdersToMake}
          isDarkMode={isDarkMode}
          onSelectAll={() => {
            const allIds = filteredOrdersToMake.map((order) => order.id);
            setSelectedOrdersToMake(
              selectedOrdersToMake.length === allIds.length ? [] : allIds
            );
          }}
          onSelectOrderToMake={toggleOrderToMakeSelection}
          onEditOrderToMake={(order: OrderToMake) => {
            setEditingOrderToMake(order);
            if (order.driver_id) {
              const selectedDriver = drivers.find(
                (d) => d.id === order.driver_id
              );
              if (selectedDriver) {
                setDriverData(selectedDriver);
              }
            }
            setShowOrderToMakeForm(true);
          }}
          onDeleteOrderToMake={deleteOrderToMake}
        />
      )}

      {/* Modals */}
      <OrderForm
        isDarkMode={isDarkMode}
        isVisible={showOrderForm}
        drivers={drivers}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        driverSearchTerm={driverSearchTerm}
        setDriverSearchTerm={setDriverSearchTerm}
        driverData={driverData}
        setDriverData={setDriverData}
        onClose={() => {
          setShowOrderForm(false);
          resetOrderForm();
        }}
        onSave={addOrder}
        onUpdate={updateOrder}
        isLoading={isLoading}
      />

      <OrderToMakeForm
        isDarkMode={isDarkMode}
        isVisible={showOrderToMakeForm}
        drivers={drivers}
        editingOrderToMake={editingOrderToMake}
        setEditingOrderToMake={setEditingOrderToMake}
        orderToMakeDriverSearchTerm={orderToMakeDriverSearchTerm}
        setOrderToMakeDriverSearchTerm={setOrderToMakeDriverSearchTerm}
        onClose={() => {
          setShowOrderToMakeForm(false);
          resetOrderToMakeForm();
        }}
        onSave={addOrderToMake}
        onUpdate={updateOrderToMake}
        onCreateOrder={createOrderFromOrderToMake}
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        isVisible={showConfirmDelete}
        isDarkMode={isDarkMode}
        isLoading={isLoading}
        deleteType={deleteType}
        itemToDelete={itemToDelete}
        selectedOrdersCount={selectedOrders.length}
        selectedOrdersToMakeCount={selectedOrdersToMake.length}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
};

export default OrdersManager;