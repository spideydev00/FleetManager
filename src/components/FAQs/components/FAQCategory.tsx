import React from "react";

interface Category {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface FAQCategoryProps {
    category: Category;
    isActive: boolean;
    isDarkMode: boolean;
    onClick: () => void;
}

const FAQCategory: React.FC<FAQCategoryProps> = ({
    category,
    isActive,
    isDarkMode,
    onClick,
}) => {
    const Icon = category.icon;

    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive
                    ? isDarkMode
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-blue-500 text-white shadow-lg"
                    : isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{category.label}</span>
        </button>
    );
};

export default FAQCategory;
