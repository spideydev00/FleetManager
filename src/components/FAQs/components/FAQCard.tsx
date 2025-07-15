import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

interface FAQCardProps {
    faq: FAQ;
    isDarkMode: boolean;
}

const FAQCard: React.FC<FAQCardProps> = ({ faq, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getCategoryColor = (category: string) => {
        const colors = {
            driver: isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800",
            orders: isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800",
            fuel: isDarkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800",
            reports: isDarkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-800",
            contracts: isDarkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-800",
            system: isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800",
        };
        return colors[category as keyof typeof colors] || colors.system;
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            driver: "Driver",
            orders: "Ordini",
            fuel: "Fuel Cards",
            reports: "Reports",
            contracts: "Contratti",
            system: "Sistema",
        };
        return labels[category as keyof typeof labels] || "Generale";
    };

    return (
        <div
            className={`border rounded-xl transition-all duration-200 hover:shadow-lg ${isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                : "bg-white border-gray-200 hover:border-gray-300"
                } ${isOpen ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
        >
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-opacity-50 transition-colors"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(faq.category)}`}>
                            {getCategoryLabel(faq.category)}
                        </span>
                    </div>
                    <h3 className={`text-lg font-medium pr-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {faq.question}
                    </h3>
                </div>
                <div className={`ml-4 p-2 rounded-full transition-all duration-200 ${isOpen
                    ? isDarkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
            </button>

            {/* Answer */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className={`px-6 pb-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="pt-4">
                        <div
                            className={`leading-relaxed whitespace-pre-line ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                            style={{
                                wordBreak: 'break-word',
                                lineHeight: '1.6'
                            }}
                        >
                            {faq.answer.split(/(\d+\))/g).map((part, index) => {
                                // Se la parte è un numero seguito da parentesi (es. "1)")
                                if (/^\d+\)$/.test(part)) {
                                    return (
                                        <span key={index} className="font-medium text-blue-600 dark:text-blue-400">
                                            {part}
                                        </span>
                                    );
                                }
                                // Altrimenti è testo normale
                                return part;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQCard;
