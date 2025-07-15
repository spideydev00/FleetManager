import React from "react";
import { FilterConfig } from "./FilterItem";

interface NumberFilterProps {
    filter: FilterConfig;
    isDarkMode: boolean;
    onUpdate: (filter: FilterConfig) => void;
}

const NumberFilter: React.FC<NumberFilterProps> = ({
    filter,
    isDarkMode,
    onUpdate,
}) => {
    const operators = [
        { value: "=", label: "Uguale a" },
        { value: ">", label: "Maggiore di" },
        { value: "<", label: "Minore di" },
        { value: ">=", label: "Maggiore o uguale a" },
        { value: "<=", label: "Minore o uguale a" },
    ];

    const getInputType = () => {
        if (filter.field === "canoneMensile") return "number";
        if (filter.field === "kmContrattuali") return "number";
        if (filter.field === "emissioni") return "number";
        return "number";
    };

    const getStep = () => {
        if (filter.field === "canoneMensile") return "0.01";
        if (filter.field === "emissioni") return "0.1";
        return "1";
    };

    const getPlaceholder = () => {
        if (filter.field === "canoneMensile") return "es. 850.00";
        if (filter.field === "kmContrattuali") return "es. 25000";
        if (filter.field === "emissioni") return "es. 120";
        return "Inserisci valore";
    };

    return (
        <div className="space-y-3">
            {/* Operator Selection */}
            <div>
                <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Condizione
                </label>
                <select
                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${isDarkMode
                            ? "bg-gray-600 border-gray-500 text-gray-200"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                    value={filter.operator}
                    onChange={(e) =>
                        onUpdate({
                            ...filter,
                            operator: e.target.value,
                        })
                    }
                >
                    {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Value Input */}
            <div>
                <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Valore
                </label>
                <input
                    type={getInputType()}
                    step={getStep()}
                    placeholder={getPlaceholder()}
                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${isDarkMode
                            ? "bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                    value={filter.value}
                    onChange={(e) =>
                        onUpdate({
                            ...filter,
                            value: parseFloat(e.target.value) || 0,
                        })
                    }
                />
            </div>
        </div>
    );
};

export default NumberFilter;
