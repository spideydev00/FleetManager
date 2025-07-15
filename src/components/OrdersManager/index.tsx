import React, { useState } from "react";
import { Order, OrderToMake, Driver } from "../../types";
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

            // Process the data and handle missing driver_ids
            const processedOrders = [];
            let unmatchedOrders = 0;
            let dataMismatchWarnings: string[] = [];

            for (let i = 0; i < jsonData.length; i++) {
              const orderData = jsonData[i];
              let driverId = orderData.driver_id;
              let selectedDriver = null;

              // If no driver_id, try to find by name first
              if (!driverId && orderData.nome_driver) {
                const matchingDriversByName = drivers.filter(
                  (d) =>
                    d.nomeDriver.toLowerCase() === orderData.nome_driver.toLowerCase()
                );

                if (matchingDriversByName.length === 1) {
                  // Perfect match by name
                  selectedDriver = matchingDriversByName[0];
                  driverId = selectedDriver.id;
                } else if (matchingDriversByName.length > 1) {
                  // Multiple drivers with same name, try to match by marca and modello
                  let bestMatch = null;
                  
                  // First try exact match on both marca and modello
                  if (orderData.marca && orderData.modello) {
                    bestMatch = matchingDriversByName.find(d => 
                      d.marca?.toLowerCase() === orderData.marca.toLowerCase() &&
                      d.modello?.toLowerCase() === orderData.modello.toLowerCase()
                    );
                  }
                  
                  // If no exact match, try matching only marca
                  if (!bestMatch && orderData.marca) {
                    bestMatch = matchingDriversByName.find(d => 
                      d.marca?.toLowerCase() === orderData.marca.toLowerCase()
                    );
                  }
                  
                  // If still no match, try matching only modello
                  if (!bestMatch && orderData.modello) {
                    bestMatch = matchingDriversByName.find(d => 
                      d.modello?.toLowerCase() === orderData.modello.toLowerCase()
                    );
                  }
                  
                  if (bestMatch) {
                    selectedDriver = bestMatch;
                    driverId = bestMatch.id;
                    console.log(`Matched driver "${orderData.nome_driver}" using vehicle info: ${bestMatch.marca} ${bestMatch.modello}`);
                  } else {
                    // No good match found, use the first one and log warning
                    selectedDriver = matchingDriversByName[0];
                    driverId = selectedDriver.id;
                    console.warn(`Multiple drivers found for "${orderData.nome_driver}" but no vehicle match. Using first driver: ${selectedDriver.marca} ${selectedDriver.modello}`);
                    unmatchedOrders++;
                  }
                } else if (matchingDriversByName.length === 0) {
                  // No driver found with this name
                  console.warn(`No driver found with name "${orderData.nome_driver}"`);
                  unmatchedOrders++;
                }
              } else if (driverId) {
                // If driver_id is provided, find the driver
                selectedDriver = drivers.find(d => d.id === driverId);
              }

              // Check for data inconsistencies and collect warnings
              if (selectedDriver) {
                const warnings = [];
                
                // Check marca mismatch
                if (orderData.marca && selectedDriver.marca && 
                    orderData.marca.toLowerCase() !== selectedDriver.marca.toLowerCase()) {
                  warnings.push(`Marca corretta da "${orderData.marca}" a "${selectedDriver.marca}"`);
                }
                
                // Check modello mismatch
                if (orderData.modello && selectedDriver.modello && 
                    orderData.modello.toLowerCase() !== selectedDriver.modello.toLowerCase()) {
                  warnings.push(`Modello corretto da "${orderData.modello}" a "${selectedDriver.modello}"`);
                }
                
                // Check fornitore mismatch
                if (orderData.fornitore && selectedDriver.noleggiatore && 
                    orderData.fornitore.toLowerCase() !== selectedDriver.noleggiatore.toLowerCase()) {
                  warnings.push(`Fornitore corretto da "${orderData.fornitore}" a "${selectedDriver.noleggiatore}"`);
                }
                
                if (warnings.length > 0) {
                  dataMismatchWarnings.push(
                    `Riga ${i + 1} - Driver "${orderData.nome_driver}": ${warnings.join(', ')}`
                  );
                }
              }

              // Use driver data instead of Excel data for consistency
              processedOrders.push({
                ...orderData,
                driver_id: driverId,
                id: orderData.id || generateUUID(),
                // Override with correct driver data
                marca: selectedDriver?.marca || orderData.marca || "",
                modello: selectedDriver?.modello || orderData.modello || "",
                fornitore: selectedDriver?.noleggiatore || orderData.fornitore || "",
              });
            }

            const { data: importedData, error } = await ordersService.importOrdersFromExcel(
              processedOrders
            );
            if (error) throw error;

            setOrders(importedData || []);
            
            // Show appropriate messages
            let successMessage = "Importazione completata con successo!";
            let hasWarnings = false;

            if (dataMismatchWarnings.length > 0) {
              const warningMessage = `Attenzione: Dati Excel corretti automaticamente con i dati del driver:\n\n${dataMismatchWarnings.slice(0, 5).join('\n')}${dataMismatchWarnings.length > 5 ? `\n\n...e altri ${dataMismatchWarnings.length - 5} avvisi` : ''}`;
              successMessage = `${successMessage}\n\n${warningMessage}`;
              hasWarnings = true;
            }

            if (unmatchedOrders > 0) {
              const unmatchedMessage = `${unmatchedOrders} ordini potrebbero non essere stati associati correttamente ai driver.`;
              successMessage = hasWarnings ? 
                `${successMessage}\n\n${unmatchedMessage}` : 
                `${successMessage}\n\n${unmatchedMessage}`;
              hasWarnings = true;
            }

            setOperationError(successMessage);
            setTimeout(() => setOperationError(""), hasWarnings ? 8000 : 3000);
            
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
          className={`p-4 rounded-lg ${
            operationError.toLowerCase().includes("success") ||
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
            className={`text-sm whitespace-pre-line ${
              operationError.toLowerCase().includes("success") ||
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
          onSelectOrder={toggleOrderToMakeSelection}
          onEditOrder={(order) => {
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
          onDeleteOrder={deleteOrderToMake}
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
