import React from "react";
import { Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { OrderToMake } from "../../../entities/types";

interface OrdersToMakeTableProps {
  ordersToMake: OrderToMake[];
  selectedOrdersToMake: string[];
  isDarkMode: boolean;
  onSelectAll: () => void;
  onSelectOrderToMake: (orderId: string) => void;
  onEditOrderToMake: (order: OrderToMake) => void;
  onDeleteOrderToMake: (orderId: string) => void;
}

const OrdersToMakeTable: React.FC<OrdersToMakeTableProps> = ({
  ordersToMake,
  selectedOrdersToMake,
  isDarkMode,
  onSelectAll,
  onSelectOrderToMake,
  onEditOrderToMake,
  onDeleteOrderToMake,
}) => {
  // Helper functions for status colors and icons
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Completata":
        return "bg-green-600 text-green-50";
      case "In corso":
        return "bg-yellow-500 text-yellow-50";
      case "Non iniziata":
      default:
        return "bg-red-600 text-red-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completata":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "In corso":
        return <Clock className="w-3 h-3 mr-1" />;
      case "Non iniziata":
      default:
        return <XCircle className="w-3 h-3 mr-1" />;
    }
  };

  const getOverallStatusColor = (status: string): string => {
    switch (status) {
      case "Completata":
        return "bg-green-600 text-green-50";
      case "In corso":
        return "bg-blue-500 text-blue-50";
      case "Non iniziata":
      default:
        return "bg-gray-500 text-gray-50";
    }
  };

  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } rounded-lg shadow overflow-hidden`}
    >
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table
          className={`min-w-full divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
        >
          <thead className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} sticky top-0 z-10`}>
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedOrdersToMake.length === ordersToMake.length &&
                    ordersToMake.length > 0
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[120px]`}
              >
                Driver
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[100px]`}
              >
                Scelta Auto
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[80px]`}
              >
                RDA
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[90px]`}
              >
                Offerte
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[90px]`}
              >
                Verifica
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[80px]`}
              >
                Firme
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[100px]`}
              >
                Stato
              </th>
              <th className="px-4 py-3 min-w-[80px]"></th>
            </tr>
          </thead>
          <tbody
            className={`${isDarkMode
              ? "bg-gray-800 divide-gray-700"
              : "bg-white divide-gray-200"
              } divide-y`}
          >
            {ordersToMake.map((orderToMake) => (
              <tr
                key={orderToMake.id}
                className={
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrdersToMake.includes(orderToMake.id)}
                    onChange={() => onSelectOrderToMake(orderToMake.id)}
                  />
                </td>
                <td
                  className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  <div className="truncate max-w-[100px]" title={orderToMake.nome_driver}>
                    {orderToMake.nome_driver}
                  </div>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center ${getStatusColor(
                      orderToMake.scelta_auto
                    )}`}
                  >
                    {getStatusIcon(orderToMake.scelta_auto)}
                    {orderToMake.scelta_auto}
                  </span>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center ${getStatusColor(
                      orderToMake.rda
                    )}`}
                  >
                    {getStatusIcon(orderToMake.rda)}
                    {orderToMake.rda}
                  </span>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center ${getStatusColor(
                      orderToMake.offerte
                    )}`}
                  >
                    {getStatusIcon(orderToMake.offerte)}
                    {orderToMake.offerte}
                  </span>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center ${getStatusColor(
                      orderToMake.verifica
                    )}`}
                  >
                    {getStatusIcon(orderToMake.verifica)}
                    {orderToMake.verifica}
                  </span>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center ${getStatusColor(
                      orderToMake.firme
                    )}`}
                  >
                    {getStatusIcon(orderToMake.firme)}
                    {orderToMake.firme}
                  </span>
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOverallStatusColor(
                      orderToMake.stato
                    )}`}
                  >
                    {orderToMake.stato}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => onEditOrderToMake(orderToMake)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Modifica ordine da fare"
                    >
                      <Edit className="w-5 h-5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => onDeleteOrderToMake(orderToMake.id)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Elimina ordine da fare"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ordersToMake.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className={`px-4 py-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Nessun ordine da fare trovato
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersToMakeTable;
