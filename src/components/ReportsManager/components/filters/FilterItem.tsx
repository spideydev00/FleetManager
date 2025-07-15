import React from "react";
import { X } from "lucide-react";
import StringFilter from "./StringFilter";
import NumberFilter from "./NumberFilter";
import DateFilter from "./DateFilter";

export interface FilterConfig {
    id: string;
    field: string;
    operator: string;
    value: string | number;
    label: string;
    type: "string" | "number" | "date";
}

interface FilterItemProps {
    filter: FilterConfig;
    isDarkMode: boolean;
    availableOptions?: string[];
    onUpdate: (filter: FilterConfig) => void;
    onRemove: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
    filter,
    isDarkMode,
    availableOptions = [],
    onUpdate,
    onRemove,
}) => {
    return (
        <div
            className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <h4
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                >
                    {filter.label}
                </h4>
                <button
                    onClick={onRemove}
                    className={`p-1 rounded ${isDarkMode
                        ? "text-gray-400 hover:text-red-400 hover:bg-gray-600"
                        : "text-gray-500 hover:text-red-500 hover:bg-gray-200"
                        }`}
                    title="Rimuovi filtro"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {filter.type === "string" && (
                <StringFilter
                    filter={filter}
                    isDarkMode={isDarkMode}
                    availableOptions={availableOptions}
                    onUpdate={onUpdate}
                />
            )}

            {filter.type === "number" && (
                <NumberFilter
                    filter={filter}
                    isDarkMode={isDarkMode}
                    onUpdate={onUpdate}
                />
            )}

            {filter.type === "date" && (
                <DateFilter
                    filter={filter}
                    isDarkMode={isDarkMode}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
};

export default FilterItem;
