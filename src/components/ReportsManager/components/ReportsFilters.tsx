import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import FilterSelector from "./filters/FilterSelector";
import FilterItem, { FilterConfig } from "./filters/FilterItem";
import { Driver } from "../../../types";

interface ReportsFiltersProps {
  isDarkMode: boolean;
  isVisible: boolean;
  drivers: Driver[];
  onFiltersChange: (filters: FilterConfig[]) => void;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  isDarkMode,
  isVisible,
  drivers,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  if (!isVisible) return null;

  const generateFilterId = () => {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getAvailableOptions = (field: string): string[] => {
    const uniqueValues = new Set<string>();

    drivers.forEach((driver) => {
      let value: string = "";

      switch (field) {
        case "noleggiatore":
          value = driver.noleggiatore || "";
          break;
        case "societa":
          value = driver.societa || "";
          break;
        case "alimentazione":
          value = driver.alimentazione || "";
          break;
        case "marca":
          value = driver.marca || "";
          break;
        default:
          return;
      }

      if (value.trim()) {
        uniqueValues.add(value.trim());
      }
    });

    return Array.from(uniqueValues).sort();
  };

  const handleAddFilter = (
    field: string,
    label: string,
    type: "string" | "number" | "date"
  ) => {
    const defaultOperator = type === "string" ? "=" : type === "date" ? ">" : ">";
    const defaultValue = type === "number" ? 0 : "";

    const newFilter: FilterConfig = {
      id: generateFilterId(),
      field,
      operator: defaultOperator,
      value: defaultValue,
      label,
      type,
    };

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleUpdateFilter = (updatedFilter: FilterConfig) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === updatedFilter.id ? updatedFilter : filter
    );
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = filters.filter((filter) => filter.id !== filterId);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAllFilters = () => {
    setFilters([]);
    onFiltersChange([]);
  };

  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        } p-6 rounded-lg shadow`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
              }`}
          >
            Filtri Avanzati
          </h3>
          <p
            className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Crea filtri personalizzati per analizzare i dati della flotta
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {filters.length > 0 && (
            <button
              onClick={handleClearAllFilters}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${isDarkMode
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filtri</span>
            </button>
          )}

          <FilterSelector
            isDarkMode={isDarkMode}
            onAddFilter={handleAddFilter}
          />
        </div>
      </div>

      {filters.length === 0 ? (
        <div
          className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          <p className="text-sm">
            Nessun filtro attivo. Clicca su "Aggiungi Filtro" per iniziare.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <FilterItem
              key={filter.id}
              filter={filter}
              isDarkMode={isDarkMode}
              availableOptions={
                filter.type === "string" ? getAvailableOptions(filter.field) : []
              }
              onUpdate={handleUpdateFilter}
              onRemove={() => handleRemoveFilter(filter.id)}
            />
          ))}
        </div>
      )}

      {filters.length > 0 && (
        <div
          className={`mt-4 p-3 rounded border ${isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-blue-50 border-blue-200"
            }`}
        >
          <p
            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-blue-700"
              }`}
          >
            <span className="font-medium">{filters.length}</span> filtro/i attivo/i.
            I report verranno aggiornati automaticamente in base ai filtri selezionati.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsFilters;
