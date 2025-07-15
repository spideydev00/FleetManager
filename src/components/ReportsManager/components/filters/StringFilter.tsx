import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { FilterConfig } from "./FilterItem";

interface StringFilterProps {
    filter: FilterConfig;
    isDarkMode: boolean;
    availableOptions: string[];
    onUpdate: (filter: FilterConfig) => void;
}

const StringFilter: React.FC<StringFilterProps> = ({
    filter,
    isDarkMode,
    availableOptions,
    onUpdate,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredOptions = useMemo(() => {
        return availableOptions.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableOptions, searchTerm]);

    const handleValueSelect = (value: string) => {
        onUpdate({
            ...filter,
            value,
        });
        setSearchTerm("");
        setShowDropdown(false);
    };

    return (
        <div className="space-y-3">
            {/* Operator (sempre "uguale a" per stringhe) */}
            <div>
                <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Condizione
                </label>
                <div
                    className={`px-3 py-2 rounded border ${isDarkMode
                        ? "bg-gray-600 border-gray-500 text-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                        }`}
                >
                    Uguale a
                </div>
            </div>

            {/* Value Selection */}
            <div>
                <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Valore
                </label>

                {filter.value ? (
                    <div className="space-y-2">
                        <div
                            className={`px-3 py-2 rounded border ${isDarkMode
                                ? "bg-gray-600 border-gray-500 text-gray-200"
                                : "bg-white border-gray-300 text-gray-900"
                                }`}
                        >
                            {filter.value}
                        </div>
                        <button
                            onClick={() => onUpdate({ ...filter, value: "" })}
                            className={`text-xs ${isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-700"
                                }`}
                        >
                            Cambia valore
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="relative">
                            <Search
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-400"
                                    }`}
                            />
                            <input
                                type="text"
                                placeholder="Cerca e seleziona..."
                                className={`w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                    ? "bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                            />
                        </div>

                        {showDropdown && (
                            <div
                                className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded border shadow-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-200"
                                    }`}
                                style={{
                                    left: 0,
                                    right: 0,
                                    minWidth: '100%'
                                }}
                            >
                                {filteredOptions.length === 0 ? (
                                    <div
                                        className={`px-3 py-2 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                            }`}
                                    >
                                        Nessun risultato
                                    </div>
                                ) : (
                                    filteredOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleValueSelect(option)}
                                            className={`w-full px-3 py-2 text-left text-sm hover:${isDarkMode ? "bg-gray-600" : "bg-gray-100"
                                                } ${isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StringFilter;
