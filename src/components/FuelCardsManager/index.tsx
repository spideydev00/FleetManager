import React, { useState } from "react";
import { FuelCard, Driver } from "../../types";
import { fuelCardsService } from "./services/fuelCardsService";
import FuelCardsActionBar from "./components/FuelCardsActionBar";
import FuelCardsFilterBar from "./components/FuelCardsFilterBar";
import FuelCardForm from "./components/FuelCardForm";
import FuelCardsTable from "./components/FuelCardsTable";
import FuelCardEditModal from "./components/FuelCardEditModal";
import FuelCardDeleteModal from "./components/FuelCardDeleteModal";
import { generateUUID } from "../../utils/generateUuid";

interface FuelCardsManagerProps {
  fuelCards: FuelCard[];
  setFuelCards: (fuelCards: FuelCard[]) => void;
  drivers: Driver[];
  isDarkMode: boolean;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
}

const FuelCardsManager: React.FC<FuelCardsManagerProps> = ({
  fuelCards,
  setFuelCards,
  drivers,
  isDarkMode,
  handleFileUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFuelCards, setSelectedFuelCards] = useState<string[]>([]);
  const [showFuelCardForm, setShowFuelCardForm] = useState(false);
  const [editingFuelCard, setEditingFuelCard] = useState<FuelCard | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [fuelCardToDelete, setFuelCardToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [operationError, setOperationError] = useState("");

  // Driver search state
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [selectedDriverData, setSelectedDriverData] = useState<Driver | null>(
    null
  );

  const [newFuelCard, setNewFuelCard] = useState<Partial<FuelCard>>({
    targa: "",
    nome_driver: "",
    societa: "",
    dataRichiesta: "",
    alimentazione: "",
    stato: "Non arrivata",
    referente: "",
    driver_id: undefined,
  });

  // Filter fuel cards
  const filteredFuelCards = fuelCards.filter((card) => {
    const matchesSearch =
      card.nome_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.targa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.societa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || card.stato === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle fuel card selection
  const toggleFuelCardSelection = (cardId: string) => {
    setSelectedFuelCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  // Select all fuel cards
  const selectAllFuelCards = () => {
    const allCardIds = filteredFuelCards.map((card) => card.id);
    setSelectedFuelCards(
      selectedFuelCards.length === allCardIds.length ? [] : allCardIds
    );
  };

  // Handle driver selection
  const handleDriverSelection = (driver: Driver) => {
    setSelectedDriverData(driver);
    setNewFuelCard({
      ...newFuelCard,
      driver_id: driver.id,
      nome_driver: driver.nomeDriver,
      targa: driver.targa || "",
      societa: driver.societa || "",
      alimentazione: driver.alimentazione || "",
      dataRichiesta: new Date().toISOString().split("T")[0],
    });
    setDriverSearchTerm("");
  };

  // Clear driver selection
  const clearDriverSelection = () => {
    setSelectedDriverData(null);
    setNewFuelCard({
      targa: "",
      nome_driver: "",
      societa: "",
      dataRichiesta: "",
      alimentazione: "",
      stato: "Non arrivata",
      referente: "",
      driver_id: undefined,
    });
    setDriverSearchTerm("");
  };

  // Reset form
  const resetFuelCardForm = () => {
    setNewFuelCard({
      targa: "",
      nome_driver: "",
      societa: "",
      dataRichiesta: "",
      alimentazione: "",
      stato: "Non arrivata",
      referente: "",
      driver_id: undefined,
    });
    setSelectedDriverData(null);
    setDriverSearchTerm("");
  };

  // Utility per estrarre il messaggio di errore
  function getErrorMessage(error: any): string {
    if (!error) return "Errore sconosciuto";
    if (typeof error === "string") return error;
    if (typeof error.message === "string") return error.message;
    return JSON.stringify(error);
  }

  // Add new fuel card
  const addFuelCard = async () => {
    if (
      !newFuelCard.targa ||
      !newFuelCard.nome_driver ||
      !newFuelCard.societa
    ) {
      setOperationError("I campi Targa, Driver e Società sono obbligatori");
      return;
    }

    setIsLoading(true);
    setOperationError("");

    try {
      const { data, error } = await fuelCardsService.createFuelCard(
        newFuelCard
      );
      if (error) throw error;

      if (data) {
        setFuelCards([...fuelCards, data]);
        setOperationError("Fuel Card aggiunta con successo!");
        setTimeout(() => setOperationError(""), 3000);
        resetFuelCardForm();
        setShowFuelCardForm(false);
      }
    } catch (error: any) {
      setOperationError(
        `Errore durante l'inserimento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update fuel card
  const updateFuelCard = async () => {
    if (
      !editingFuelCard?.targa ||
      !editingFuelCard?.nome_driver ||
      !editingFuelCard?.societa
    ) {
      setOperationError("I campi Targa, Driver e Società sono obbligatori");
      return;
    }

    setIsLoading(true);
    setOperationError("");

    try {
      const { error } = await fuelCardsService.updateFuelCard(
        editingFuelCard.id,
        editingFuelCard
      );
      if (error) throw error;

      setFuelCards(
        fuelCards.map((card) =>
          card.id === editingFuelCard.id ? editingFuelCard : card
        )
      );
      setEditingFuelCard(null);
      setOperationError("Fuel card aggiornata con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (error: any) {
      setOperationError(
        `Errore durante l'aggiornamento: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete fuel card
  const deleteFuelCard = (cardId: string) => {
    setFuelCardToDelete(cardId);
    setShowConfirmDelete(true);
  };

  // Delete multiple fuel cards
  const deleteMultipleFuelCards = () => {
    if (selectedFuelCards.length === 0) return;
    setFuelCardToDelete(null);
    setShowConfirmDelete(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setIsLoading(true);
    setOperationError("");

    try {
      if (fuelCardToDelete) {
        const { error } = await fuelCardsService.deleteFuelCard(
          fuelCardToDelete
        );
        if (error) throw error;

        setFuelCards(fuelCards.filter((card) => card.id !== fuelCardToDelete));
        setOperationError("Fuel card eliminata con successo!");
      } else {
        const { error } = await fuelCardsService.deleteMultipleFuelCards(
          selectedFuelCards
        );
        if (error) throw error;

        setFuelCards(
          fuelCards.filter((card) => !selectedFuelCards.includes(card.id))
        );
        setOperationError(
          `${selectedFuelCards.length} fuel cards eliminate con successo!`
        );
        setSelectedFuelCards([]);
      }

      setShowConfirmDelete(false);
      setFuelCardToDelete(null);
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
    const { success, error } = await fuelCardsService.exportFuelCardsToExcel(
      fuelCards
    );
    if (error) {
      setOperationError(
        `Errore durante l'esportazione: ${getErrorMessage(error)}`
      );
    } else {
      setOperationError("File Excel esportato con successo!");
      setTimeout(() => setOperationError(""), 3000);
    }
  };

  // Handle Excel import with enhanced driver matching and validation
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
            const processedFuelCards = [];
            let unmatchedCards = 0;
            let dataMismatchWarnings: string[] = [];

            for (let i = 0; i < jsonData.length; i++) {
              const cardData = jsonData[i];
              let driverId = cardData.driver_id;
              let selectedDriver = null;

              // If no driver_id, try to find by name and vehicle info
              if (!driverId && cardData.nome_driver) {
                const matchingDriversByName = drivers.filter(
                  (d) =>
                    d.nomeDriver.toLowerCase() === cardData.nome_driver.toLowerCase()
                );

                if (matchingDriversByName.length === 1) {
                  selectedDriver = matchingDriversByName[0];
                  driverId = selectedDriver.id;
                } else if (matchingDriversByName.length > 1) {
                  // Multiple drivers with same name, try to match by targa
                  let bestMatch = null;

                  if (cardData.targa) {
                    bestMatch = matchingDriversByName.find(d =>
                      d.targa?.toLowerCase() === cardData.targa.toLowerCase()
                    );
                  }

                  if (bestMatch) {
                    selectedDriver = bestMatch;
                    driverId = bestMatch.id;
                    console.log(`Matched driver "${cardData.nome_driver}" using targa: ${bestMatch.targa}`);
                  } else {
                    selectedDriver = matchingDriversByName[0];
                    driverId = selectedDriver.id;
                    console.warn(`Multiple drivers found for "${cardData.nome_driver}" but no targa match. Using first driver.`);
                    unmatchedCards++;
                  }
                } else if (matchingDriversByName.length === 0) {
                  console.warn(`No driver found with name "${cardData.nome_driver}"`);
                  unmatchedCards++;
                }
              } else if (driverId) {
                selectedDriver = drivers.find(d => d.id === driverId);
              }

              // Check for data inconsistencies and collect warnings
              if (selectedDriver) {
                const warnings = [];

                // Check nome_driver mismatch
                if (cardData.nome_driver && selectedDriver.nomeDriver &&
                  cardData.nome_driver.toLowerCase() !== selectedDriver.nomeDriver.toLowerCase()) {
                  warnings.push(`Nome driver corretto da "${cardData.nome_driver}" a "${selectedDriver.nomeDriver}"`);
                }

                // Check targa mismatch
                if (cardData.targa && selectedDriver.targa &&
                  cardData.targa.toLowerCase() !== selectedDriver.targa.toLowerCase()) {
                  warnings.push(`Targa corretta da "${cardData.targa}" a "${selectedDriver.targa}"`);
                }

                // Check alimentazione mismatch
                if (cardData.alimentazione && selectedDriver.alimentazione &&
                  cardData.alimentazione.toLowerCase() !== selectedDriver.alimentazione.toLowerCase()) {
                  warnings.push(`Alimentazione corretta da "${cardData.alimentazione}" a "${selectedDriver.alimentazione}"`);
                }

                // Check societa mismatch
                if (cardData.societa && selectedDriver.societa &&
                  cardData.societa.toLowerCase() !== selectedDriver.societa.toLowerCase()) {
                  warnings.push(`Società corretta da "${cardData.societa}" a "${selectedDriver.societa}"`);
                }

                if (warnings.length > 0) {
                  dataMismatchWarnings.push(
                    `Riga ${i + 1} - Driver "${cardData.nome_driver || selectedDriver.nomeDriver}": ${warnings.join(', ')}`
                  );
                }
              }

              // Use driver data instead of Excel data for consistency
              processedFuelCards.push({
                ...cardData,
                id: cardData.id || generateUUID(),
                driver_id: driverId,
                // Override with correct driver data
                nome_driver: selectedDriver?.nomeDriver || cardData.nome_driver || "",
                targa: selectedDriver?.targa || cardData.targa || "",
                societa: selectedDriver?.societa || cardData.societa || "",
                alimentazione: selectedDriver?.alimentazione || cardData.alimentazione || "",
                dataRichiesta: cardData.data_richiesta || cardData.dataRichiesta || new Date().toISOString().split("T")[0],
              });
            }

            const { data: importedData, error } = await fuelCardsService.importFuelCardsFromExcel(
              processedFuelCards
            );
            if (error) throw error;

            setFuelCards(importedData || []);

            // Show appropriate messages
            let successMessage = "Importazione completata con successo!";
            let hasWarnings = false;

            if (dataMismatchWarnings.length > 0) {
              const warningMessage = `Attenzione: Dati Excel corretti automaticamente con i dati del driver:\n\n${dataMismatchWarnings.slice(0, 5).join('\n')}${dataMismatchWarnings.length > 5 ? `\n\n...e altri ${dataMismatchWarnings.length - 5} avvisi` : ''}`;
              successMessage = `${successMessage}\n\n${warningMessage}`;
              hasWarnings = true;
            }

            if (unmatchedCards > 0) {
              const unmatchedMessage = `${unmatchedCards} fuel cards potrebbero non essere state associate correttamente ai driver.`;
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

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <FuelCardsActionBar
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFuelCardsCount={selectedFuelCards.length}
        onAddFuelCard={() => setShowFuelCardForm(true)}
        onImportExcel={handleExcelImport}
        onExportExcel={exportToExcel}
        onDeleteSelected={deleteMultipleFuelCards}
        isLoading={isLoading}
        uploadingExcel={uploadingExcel}
      />

      {/* Filter Bar */}
      <FuelCardsFilterBar
        isDarkMode={isDarkMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredCount={filteredFuelCards.length}
        totalCount={fuelCards.length}
      />

      {/* Operation Error Message */}
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

      {/* Fuel Card Form */}
      <FuelCardForm
        isDarkMode={isDarkMode}
        isVisible={showFuelCardForm}
        drivers={drivers}
        newFuelCard={newFuelCard}
        setNewFuelCard={setNewFuelCard}
        selectedDriverData={selectedDriverData}
        driverSearchTerm={driverSearchTerm}
        setDriverSearchTerm={setDriverSearchTerm}
        onDriverSelection={handleDriverSelection}
        onClearDriverSelection={clearDriverSelection}
        onClose={() => {
          setShowFuelCardForm(false);
          resetFuelCardForm();
        }}
        onSave={addFuelCard}
        isLoading={isLoading}
        operationError={operationError}
      />

      {/* Fuel Cards Table */}
      <FuelCardsTable
        fuelCards={fuelCards}
        filteredFuelCards={filteredFuelCards}
        selectedFuelCards={selectedFuelCards}
        isDarkMode={isDarkMode}
        onSelectAll={selectAllFuelCards}
        onSelectFuelCard={toggleFuelCardSelection}
        onEditFuelCard={setEditingFuelCard}
        onDeleteFuelCard={deleteFuelCard}
      />

      {/* Edit Modal */}
      {editingFuelCard && (
        <FuelCardEditModal
          isVisible={!!editingFuelCard}
          isDarkMode={isDarkMode}
          editingFuelCard={editingFuelCard}
          setEditingFuelCard={setEditingFuelCard}
          onClose={() => {
            setEditingFuelCard(null);
            setOperationError("");
          }}
          onSave={updateFuelCard}
          isLoading={isLoading}
          operationError={operationError}
        />
      )}

      {/* Delete Modal */}
      <FuelCardDeleteModal
        isVisible={showConfirmDelete}
        isDarkMode={isDarkMode}
        isLoading={isLoading}
        fuelCardToDelete={fuelCardToDelete}
        selectedFuelCardsCount={selectedFuelCards.length}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
};

export default FuelCardsManager;
