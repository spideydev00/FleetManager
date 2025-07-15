import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { OrderToMake } from "../../../entities/types";

interface OrdersToMakeTableProps {
  ordersToMake: OrderToMake[];
  selectedOrdersToMake: string[];
  isDarkMode: boolean;
  onSelectAll: () => void;
  onSelectOrder: (orderId: string) => void;
  onEditOrder: (order: OrderToMake) => void;
  onDeleteOrder: (orderId: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "";

  if (status === "Approvato") {
    colorClass = "bg-green-600 text-green-50";
  } else if (status === "In valutazione") {
    colorClass = "bg-yellow-500 text-yellow-50";
  } else if (status === "Respinto") {
    colorClass = "bg-red-600 text-red-50";
  } else if (status === "Non iniziata") {
    colorClass = "bg-gray-500 text-gray-50";
  } else if (status === "In corso") {
    colorClass = "bg-blue-500 text-blue-50";
  } else if (status === "Completata") {
    colorClass = "bg-teal-600 text-teal-50";
  } else {
    colorClass = "bg-gray-400 text-gray-50";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};

const OrdersToMakeTable: React.FC<OrdersToMakeTableProps> = ({
  ordersToMake,
  selectedOrdersToMake,
  isDarkMode,
  onSelectAll,
  onSelectOrder,
  onEditOrder,
  onDeleteOrder,
}) => {
  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } rounded-lg shadow overflow-hidden`}
    >
      <table
        className={`min-w-full divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"
          }`}
      >
        <thead className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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
                } uppercase tracking-wider`}
            >
              Driver
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              Scelta Auto
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              RDA
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              Offerte
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              Verifica
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              Firme
            </th>
            <th
              className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                } uppercase tracking-wider`}
            >
              Stato Complessivo
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody
          className={`${isDarkMode
              ? "bg-gray-800 divide-gray-700"
              : "bg-white divide-gray-200"
            } divide-y`}
        >
          {ordersToMake.map((order) => (
            <tr
              key={order.id}
              className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
            >
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedOrdersToMake.includes(order.id)}
                  onChange={() => onSelectOrder(order.id)}
                />
              </td>
              <td
                className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
              >
                {order.nome_driver}
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.scelta_auto} />
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.rda} />
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.offerte} />
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.verifica} />
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.firme} />
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                <StatusBadge status={order.stato} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => onEditOrder(order)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                      }`}
                    title="Modifica ordine da fare"
                  >
                    <Edit className="w-5 h-5 text-amber-500" />
                  </button>
                  <button
                    onClick={() => onDeleteOrder(order.id)}
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
                colSpan={8}
                className={`px-4 py-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Nessun ordine da fare trovato con i filtri attuali
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersToMakeTable;
