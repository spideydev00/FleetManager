import React from "react";

interface OrdersTabsProps {
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({
  isDarkMode,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex mb-4">
      <button
        className={`px-4 py-2 ${
          activeTab === "inCorso"
            ? isDarkMode
              ? "border-b-2 border-blue-500 text-blue-400"
              : "border-b-2 border-blue-500 text-blue-600"
            : isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("inCorso")}
      >
        Ordini in Corso
      </button>
      <button
        className={`px-4 py-2 ${
          activeTab === "daFare"
            ? isDarkMode
              ? "border-b-2 border-blue-500 text-blue-400"
              : "border-b-2 border-blue-500 text-blue-600"
            : isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("daFare")}
      >
        Ordini da Fare
      </button>
    </div>
  );
};

export default OrdersTabs;
