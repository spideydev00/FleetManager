import React, { useState, useEffect } from "react";
import { Driver } from "../../types";
import * as XLSX from "xlsx";
import { supabase } from "../../supabase";
import DriverDetailModal from "./components/DriverDetailModal";
import DriverEditModal from "./components/DriverEditModal";
import DriversActionBar from "./components/DriversActionBar";
import DriversTable from "./components/DriversTable";
import DriverForm from "./components/DriverForm";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { Check, X } from "lucide-react";
import { driversService } from "./services/driversService";

interface DriversManagerProps {
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
}

const DriversManager: React.FC<DriversManagerProps> = ({
  drivers,
  setDrivers,
  searchTerm,
  setSearchTerm,
  isDarkMode,
  fileInputRef,
  handleFileUpload,
}) => {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [operationError, setOperationError] = useState("");

  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    nomeDriver: "",
    centroCosto: "",
    societa: "",
    noleggiatore: "",
    marca: "",
    modello: "",
    targa: "",
    alimentazione: "",
    emissioni: "",
    inizioContratto: "",
    scadenzaContratto: "",
    canoneMensile: 0,
    kmContrattuali: 0,
  });

  const getFullName = (driver: Driver) => `${driver.nomeDriver || ""}`.trim();

  const filteredDrivers = drivers.filter(
    (driver) =>
      getFullName(driver).toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.targa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.societa &&
        driver.societa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.marca &&
        driver.modello &&
        driver.modello.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleDriverSelection = (driverId: string) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  const selectAllDrivers = () => {
    const allIds = filteredDrivers.map((d) => d.id);
    setSelectedDrivers((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const deleteDriver = (driverId: string) => {
    setDriverToDelete(driverId);
    setShowConfirmDelete(true);
  };

  const deleteMultipleDrivers = () => {
    if (!selectedDrivers.length) return;
    setDriverToDelete(null);
    setShowConfirmDelete(true);
  };

  const refreshDriver = async () => {
    if (!selectedDriver) return;
    setIsLoading(true);
    try {
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", selectedDriver.id)
        .single();
      if (driverError) throw driverError;

      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("*")
        .eq("driver_id", selectedDriver.id);
      if (attachmentsError) throw attachmentsError;

      if (driverData) {
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

        const completeDriver: Driver & { allegati: any[] } = {
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

        setSelectedDriver(completeDriver);
        const updatedDrivers = drivers.map((d: Driver) =>
          d.id === completeDriver.id ? completeDriver : d
        );
        setDrivers(updatedDrivers);
      }
    } catch {
      setOperationError("Errore durante l'aggiornamento dei dati del driver");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportExcel = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls";
    fileInput.onchange = async (ev) => {
      const event = ev as unknown as React.ChangeEvent<HTMLInputElement>;
      if (!event.target.files?.length) return;

      setIsLoading(true);
      setOperationError("");

      try {
        const file = event.target.files[0];
        console.log("Selected file:", file.name);

        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            const wb = XLSX.read(data, { type: "binary" });
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

            console.log("Excel data parsed:", jsonData);

            if (!jsonData.length) {
              throw new Error("Il file Excel è vuoto o non contiene dati validi");
            }

            const mappedDrivers = jsonData.map((row, index) => {
              console.log(`Processing row ${index + 1}:`, row);

              // Handle numeric fields
              let canoneMensile = 0;
              let kmContrattuali = 0;

              // Parse canone_mensile
              const cv = row["canone_mensile"];
              if (cv !== undefined && cv !== null && cv !== "") {
                if (typeof cv === "string") {
                  const clean = cv.replace(/[€$,\s]/g, "").replace(",", ".");
                  canoneMensile = parseFloat(clean) || 0;
                } else if (typeof cv === "number") {
                  canoneMensile = cv;
                }
              }

              // Parse km_contrattuali
              const kv = row["km_contrattuali"];
              if (kv !== undefined && kv !== null && kv !== "") {
                if (typeof kv === "string") {
                  const clean = kv.replace(/[^\d.-]/g, "");
                  kmContrattuali = parseInt(clean) || 0;
                } else if (typeof kv === "number") {
                  kmContrattuali = Math.round(kv);
                }
              }

              // Handle dates - more robust date parsing
              const parseExcelDate = (dateValue: any) => {
                if (!dateValue) return new Date();
                
                // If it's already a valid Date object
                if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
                  return dateValue;
                }
                
                // If it's a string in DD/MM/YYYY format
                if (typeof dateValue === "string" && dateValue.includes("/")) {
                  const parts = dateValue.split("/");
                  if (parts.length === 3) {
                    // Convert DD/MM/YYYY to MM/DD/YYYY for proper parsing
                    const [day, month, year] = parts;
                    return new Date(`${month}/${day}/${year}`);
                  }
                }
                
                // If it's an Excel serial number
                if (typeof dateValue === "number" && dateValue > 25567) { // Excel dates after 1970
                  const excelEpoch = new Date(1900, 0, 1);
                  const msPerDay = 24 * 60 * 60 * 1000;
                  return new Date(excelEpoch.getTime() + (dateValue - 2) * msPerDay);
                }
                
                // Try direct parsing as fallback
                try {
                  const parsed = new Date(dateValue);
                  return isNaN(parsed.getTime()) ? new Date() : parsed;
                } catch {
                  return new Date();
                }
              };

              const driver = {
                id: row["id"] || undefined, // Let service generate UUID if missing
                nomeDriver: row["nome_driver"] || "",
                centroCosto: row["centro_costo"] || "",
                societa: row["societa"] || "",
                noleggiatore: row["noleggiatore"] || "",
                marca: row["marca"] || "",
                modello: row["modello"] || "",
                targa: row["targa"] || "",
                alimentazione: row["alimentazione"] || "",
                emissioni: row["emissioni"] || "",
                inizioContratto: parseExcelDate(row["inizio_contratto"]),
                scadenzaContratto: parseExcelDate(row["scadenza_contratto"]),
                canoneMensile,
                kmContrattuali,
              };

              console.log(`Mapped driver ${index + 1}:`, driver);
              return driver;
            });

            console.log("All mapped drivers:", mappedDrivers);

            if (
              confirm(
                `Sostituire tutti i ${drivers.length} driver esistenti con i ${mappedDrivers.length} nuovi driver importati dal file Excel?\n\nATTENZIONE: Questa operazione eliminerà definitivamente tutti i driver esistenti.`
              )
            ) {
              console.log("User confirmed import, starting service call");

              // Use the service to import drivers
              const { data: importedDrivers, error: importError } =
                await driversService.importDriversFromExcel(mappedDrivers);

              if (importError) {
                console.error("Import error from service:", importError);
                throw importError;
              }

              if (importedDrivers) {
                console.log("Import successful, updating state with:", importedDrivers);
                setDrivers(importedDrivers);
                setOperationError("Importazione completata con successo!");
                setTimeout(() => setOperationError(""), 5000);
              } else {
                throw new Error("Nessun dato restituito dall'importazione");
              }
            } else {
              console.log("User cancelled import");
            }
          } catch (err: any) {
            console.error("Excel processing error:", err);
            if (err.code === "23505") {
              setOperationError("Errore: targhe duplicate nel file Excel");
            } else if (err.code === "22P02") {
              setOperationError("Errore di formato nei dati numerici");
            } else {
              setOperationError(`Errore durante l'import: ${err.message}`);
            }
          } finally {
            setIsLoading(false);
          }
        };

        reader.onerror = () => {
          console.error("File reader error");
          setOperationError("Errore durante la lettura del file");
          setIsLoading(false);
        };

        reader.readAsBinaryString(file);
      } catch (err: any) {
        console.error("File handling error:", err);
        setOperationError(
          err.message
            ? `Errore durante l'elaborazione del file: ${err.message}`
            : "Errore durante l'elaborazione del file"
        );
        setIsLoading(false);
      }
    };
    fileInput.click();
  };

  const handleExportExcel = async () => {
    setIsLoading(true);
    setOperationError("");

    try {
      const { success, error } = await driversService.exportDriversToExcel(drivers);

      if (error) throw error;

      if (success) {
        setOperationError("Esportazione completata con successo!");
        setTimeout(() => setOperationError(""), 3000);
      }
    } catch (err: any) {
      setOperationError(`Errore durante l'esportazione: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount?: number | null) => {
    const v = amount ?? 0;
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(v);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOperationError("");

    try {
      if (driverToDelete) {
        const { error } = await supabase
          .from("drivers")
          .delete()
          .eq("id", driverToDelete);
        if (error) throw error;

        const filteredDriversList = drivers.filter(
          (d: Driver) => d.id !== driverToDelete
        );
        setDrivers(filteredDriversList);
        setOperationError("Driver eliminato con successo");
      } else if (selectedDrivers.length) {
        const { error } = await supabase
          .from("drivers")
          .delete()
          .in("id", selectedDrivers);
        if (error) throw error;

        const filteredMultipleDrivers = drivers.filter(
          (d: Driver) => !selectedDrivers.includes(d.id)
        );
        setDrivers(filteredMultipleDrivers);
        setOperationError(
          `${selectedDrivers.length} driver eliminati con successo`
        );
        setSelectedDrivers([]);
      }

      setShowConfirmDelete(false);
      setDriverToDelete(null);
      setTimeout(() => setOperationError(""), 3000);
    } catch (err: any) {
      setOperationError(`Errore durante l'eliminazione: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDriver = async () => {
    if (!newDriver.nomeDriver || !newDriver.targa) {
      setOperationError("I campi Nome Driver e Targa sono obbligatori");
      return;
    }

    setIsLoading(true);
    setOperationError("");

    try {
      const payload = {
        nome_driver: newDriver.nomeDriver,
        centro_costo: newDriver.centroCosto || "",
        societa: newDriver.societa || "",
        noleggiatore: newDriver.noleggiatore || "",
        marca: newDriver.marca || "",
        modello: newDriver.modello || "",
        targa: newDriver.targa || "",
        alimentazione: newDriver.alimentazione || "",
        emissioni: newDriver.emissioni || "",
        inizio_contratto: newDriver.inizioContratto || null,
        scadenza_contratto: newDriver.scadenzaContratto || null,
        canone_mensile: newDriver.canoneMensile || 0,
        km_contrattuali: newDriver.kmContrattuali || 0,
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

        const updatedDriversList = [inserted, ...drivers];
        setDrivers(updatedDriversList);
      }

      setNewDriver({
        nomeDriver: "",
        centroCosto: "",
        societa: "",
        noleggiatore: "",
        marca: "",
        modello: "",
        targa: "",
        alimentazione: "",
        emissioni: "",
        inizioContratto: "",
        scadenzaContratto: "",
        canoneMensile: 0,
        kmContrattuali: 0,
      });
      setShowDriverForm(false);
      setOperationError("Driver aggiunto con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (err: any) {
      setOperationError(`Errore durante l'inserimento: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver?.nomeDriver || !editingDriver?.targa) {
      setOperationError("I campi Nome Driver e Targa sono obbligatori");
      return;
    }

    setIsLoading(true);
    setOperationError("");

    try {
      const cm =
        typeof editingDriver.canoneMensile === "string"
          ? parseFloat(editingDriver.canoneMensile)
          : editingDriver.canoneMensile || 0;

      const kmc =
        typeof editingDriver.kmContrattuali === "string"
          ? parseInt(editingDriver.kmContrattuali)
          : editingDriver.kmContrattuali || 0;

      const { error } = await supabase
        .from("drivers")
        .update({
          nome_driver: editingDriver.nomeDriver,
          centro_costo: editingDriver.centroCosto,
          societa: editingDriver.societa,
          noleggiatore: editingDriver.noleggiatore,
          marca: editingDriver.marca,
          modello: editingDriver.modello,
          targa: editingDriver.targa,
          alimentazione: editingDriver.alimentazione,
          emissioni: editingDriver.emissioni,
          inizio_contratto: editingDriver.inizioContratto,
          scadenza_contratto: editingDriver.scadenzaContratto,
          canone_mensile: cm,
          km_contrattuali: kmc,
        })
        .eq("id", editingDriver.id);
      if (error) throw error;

      const updatedDriversList = drivers.map((d: Driver) =>
        d.id === editingDriver.id
          ? { ...editingDriver, canoneMensile: cm, kmContrattuali: kmc }
          : d
      );
      setDrivers(updatedDriversList);
      setEditingDriver(null);
      setOperationError("Driver aggiornato con successo!");
      setTimeout(() => setOperationError(""), 3000);
    } catch (err: any) {
      setOperationError(`Errore durante l'aggiornamento: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!operationError) return;
    const t = setTimeout(() => setOperationError(""), 5000);
    return () => clearTimeout(t);
  }, [operationError]);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <DriversActionBar
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDriversCount={selectedDrivers.length}
        onAddDriver={() => setShowDriverForm(true)}
        onImportExcel={handleImportExcel}
        onExportExcel={handleExportExcel}
        onDeleteSelected={deleteMultipleDrivers}
        isLoading={isLoading}
      />

      {/* Operation message toast */}
      {operationError && (
        <div
          className={`p-4 rounded-lg ${
            operationError.toLowerCase().includes("success") ||
            operationError.toLowerCase().includes("completat") ||
            operationError.toLowerCase().includes("aggiornato con")
              ? isDarkMode
                ? "bg-green-900"
                : "bg-green-100"
              : isDarkMode
              ? "bg-red-900"
              : "bg-red-100"
          }`}
        >
          <div className="flex">
            <div
              className={`flex-shrink-0 ${
                operationError.toLowerCase().includes("success") ||
                operationError.toLowerCase().includes("completat") ||
                operationError.toLowerCase().includes("aggiornato con")
                  ? isDarkMode
                    ? "text-green-300"
                    : "text-green-500"
                  : isDarkMode
                  ? "text-red-300"
                  : "text-red-500"
              }`}
            >
              {operationError.toLowerCase().includes("success") ||
              operationError.toLowerCase().includes("completat") ||
              operationError.toLowerCase().includes("aggiornato con") ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm ${
                  operationError.toLowerCase().includes("success") ||
                  operationError.toLowerCase().includes("completat") ||
                  operationError.toLowerCase().includes("aggiornato con")
                    ? isDarkMode
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
          </div>
        </div>
      )}

      {/* Driver Form */}
      <DriverForm
        isDarkMode={isDarkMode}
        isVisible={showDriverForm}
        newDriver={newDriver}
        setNewDriver={setNewDriver}
        onClose={() => setShowDriverForm(false)}
        onSave={handleSaveDriver}
        isLoading={isLoading}
      />

      {/* Drivers Table */}
      <DriversTable
        drivers={drivers}
        filteredDrivers={filteredDrivers}
        selectedDrivers={selectedDrivers}
        isDarkMode={isDarkMode}
        onSelectAll={selectAllDrivers}
        onSelectDriver={toggleDriverSelection}
        onViewDriver={setSelectedDriver}
        onEditDriver={setEditingDriver}
        onDeleteDriver={deleteDriver}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isVisible={showConfirmDelete}
        isDarkMode={isDarkMode}
        isLoading={isLoading}
        driverToDelete={driverToDelete}
        selectedDriversCount={selectedDrivers.length}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />

      {/* Edit Driver Modal */}
      {editingDriver && (
        <DriverEditModal
          driver={editingDriver}
          isDarkMode={isDarkMode}
          onClose={() => setEditingDriver(null)}
          onSave={handleUpdateDriver}
          isLoading={isLoading}
          editingDriver={editingDriver}
          setEditingDriver={setEditingDriver}
          refreshDriver={refreshDriver}
        />
      )}

      {/* Driver Details Modal */}
      {selectedDriver && (
        <DriverDetailModal
          driver={selectedDriver}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedDriver(null)}
          onEdit={(driver) => {
            setSelectedDriver(null);
            setEditingDriver(driver);
          }}
          formatCurrency={formatCurrency}
          refreshDriver={refreshDriver}
        />
      )}
    </div>
  );
};

export default DriversManager;
