import React from "react";
import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Order } from "../../../entities/types";

interface OrdersTableProps {
  orders: Order[];
  selectedOrders: string[];
  isDarkMode: boolean;
  onSelectAll: () => void;
  onSelectOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  selectedOrders,
  isDarkMode,
  onSelectAll,
  onSelectOrder,
  onEditOrder,
  onDeleteOrder,
}) => {
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "ordine") {
      const getYearAndNumber = (ordine: string) => {
        const parts = ordine.split("-");
        if (parts.length === 3) {
          return {
            year: parseInt(parts[1], 10),
            number: parseInt(parts[2], 10),
          };
        }
        return { year: 0, number: 0 };
      };

      const aOrder = getYearAndNumber(a.ordine);
      const bOrder = getYearAndNumber(b.ordine);

      if (aOrder.year !== bOrder.year) {
        return sortDirection === "asc"
          ? aOrder.year - bOrder.year
          : bOrder.year - aOrder.year;
      }
      return sortDirection === "asc"
        ? aOrder.number - bOrder.number
        : bOrder.number - aOrder.number;
    }

    if (sortField === "data_ordine") {
      const aDate = new Date(a.data_ordine).getTime();
      const bDate = new Date(b.data_ordine).getTime();
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    }

    return 0;
  });

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
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider cursor-pointer min-w-[120px]`}
                onClick={() => handleSort("ordine")}
              >
                <div className="flex items-center">
                  Ordine
                  {sortField === "ordine" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="w-3 h-3 ml-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 ml-1" />
                    ))}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[120px]`}
              >
                Driver
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[150px]`}
              >
                Veicolo
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider min-w-[120px]`}
              >
                Fornitore
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider cursor-pointer min-w-[110px]`}
                onClick={() => handleSort("data_ordine")}
              >
                <div className="flex items-center">
                  Data Ordine
                  {sortField === "data_ordine" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="w-3 h-3 ml-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 ml-1" />
                    ))}
                </div>
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
            {sortedOrders.map((order) => (
              <tr
                key={order.id}
                className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => onSelectOrder(order.id)}
                  />
                </td>
                <td
                  className={`px-4 py-4 text-sm font-mono ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  <div className="truncate max-w-[100px]" title={order.ordine}>
                    {order.ordine}
                  </div>
                </td>
                <td
                  className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  <div className="max-w-[120px] break-words" title={order.nome_driver}>
                    {order.nome_driver}
                  </div>
                </td>
                <td
                  className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  <div className="max-w-[130px]">
                    <div className="font-medium truncate" title={`${order.marca} ${order.modello}`}>
                      {order.marca}
                    </div>
                    <div className="text-xs truncate" title={order.modello}>
                      {order.modello}
                    </div>
                  </div>
                </td>
                <td
                  className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  <div className="truncate max-w-[100px]" title={order.fornitore}>
                    {order.fornitore}
                  </div>
                </td>
                <td
                  className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {new Date(order.data_ordine).toLocaleDateString("it-IT")}
                </td>
                <td className={`px-4 py-4 text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.consegnata
                      ? "bg-green-600 text-green-50"
                      : "bg-red-600 text-red-50"
                      }`}
                  >
                    {order.consegnata ? "Consegnata" : "Non consegnata"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => onEditOrder(order)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Modifica ordine"
                    >
                      <Edit className="w-5 h-5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Elimina ordine"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedOrders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className={`px-4 py-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Nessun ordine trovato con i filtri attuali
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
