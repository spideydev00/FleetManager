import React, { useState } from "react";
import { Plus } from "lucide-react";

interface FilterOption {
    field: string;
    label: string;
    type: "string" | "number" | "date";
}

interface FilterSelectorProps {
    isDarkMode: boolean;
    onAddFilter: (field: string, label: string, type: "string" | "number" | "date") => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
    isDarkMode,
    onAddFilter,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const filterOptions: FilterOption[] = [
        { field: "noleggiatore", label: "Noleggiatore", type: "string" },
        { field: "societa", label: "Società", type: "string" },
        { field: "alimentazione", label: "Alimentazione", type: "string" },
        { field: "marca", label: "Marca", type: "string" },
        { field: "scadenzaContratto", label: "Scadenza Contratto", type: "date" },
        { field: "canoneMensile", label: "Canone Mensile", type: "number" },
        { field: "kmContrattuali", label: "Km Contrattuali", type: "number" },
        { field: "emissioni", label: "Emissioni CO2", type: "number" },
    ];

    const handleAddFilter = (option: FilterOption) => {
        onAddFilter(option.field, option.label, option.type);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
            >
                <Plus className="w-4 h-4" />
                <span>Seleziona Campo</span>
            </button>

            {showDropdown && (
                <div
                    className={`absolute z-20 mt-2 w-64 rounded-lg border shadow-lg right-0 ${isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                        }`}
                >
                    <div className="p-2">
                        <h3
                            className={`text-sm font-medium mb-2 px-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                }`}
                        >
                            Seleziona Campo da Filtrare
                        </h3>
                        <div className="space-y-1">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.field}
                                    onClick={() => handleAddFilter(option)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm hover:${isDarkMode ? "bg-gray-600" : "bg-gray-100"
                                        } ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                        }`}
                                >
                                    <span className="font-medium">{option.label}</span>
                                    <span
                                        className={`ml-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                            }`}
                                    >
                                        ({option.type === "string" ? "Testo" : option.type === "number" ? "Numero" : "Data"})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterSelector;
