import React from "react";
import { FilterConfig } from "./FilterItem";

interface DateFilterProps {
    filter: FilterConfig;
    isDarkMode: boolean;
    onUpdate: (filter: FilterConfig) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
    filter,
    isDarkMode,
    onUpdate,
}) => {
    const operators = [
        { value: ">", label: "Maggiore di (dopo)" },
        { value: "<", label: "Minore di (prima)" },
        { value: "=", label: "Uguale a" },
    ];

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

            {/* Date Input */}
            <div>
                <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    Data
                </label>
                <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${isDarkMode
                            ? "bg-gray-600 border-gray-500 text-gray-200 dark-calendar"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                    value={filter.value ? filter.value.toString() : ""}
                    onChange={(e) =>
                        onUpdate({
                            ...filter,
                            value: e.target.value,
                        })
                    }
                />
            </div>
        </div>
    );
};

export default DateFilter;
