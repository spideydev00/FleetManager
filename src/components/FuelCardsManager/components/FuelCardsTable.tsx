import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { FuelCard } from "../../../entities/types";

interface FuelCardsTableProps {
  fuelCards: FuelCard[];
  filteredFuelCards: FuelCard[];
  selectedFuelCards: string[];
  isDarkMode: boolean;
  onSelectAll: () => void;
  onSelectFuelCard: (cardId: string) => void;
  onEditFuelCard: (card: FuelCard) => void;
  onDeleteFuelCard: (cardId: string) => void;
}

const FuelCardsTable: React.FC<FuelCardsTableProps> = ({
  fuelCards,
  filteredFuelCards,
  selectedFuelCards,
  isDarkMode,
  onSelectAll,
  onSelectFuelCard,
  onEditFuelCard,
  onDeleteFuelCard,
}) => {
  return (
    <div
      className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        } rounded-lg shadow overflow-hidden`}
    >
      <div
        className={`px-4 py-3 border-b ${isDarkMode
          ? "border-gray-700 bg-gray-900"
          : "border-gray-200 bg-gray-50"
          }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={
                selectedFuelCards.length === filteredFuelCards.length &&
                filteredFuelCards.length > 0
              }
              onChange={onSelectAll}
            />
            <h3
              className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
            >
              Fuel Cards
            </h3>
          </div>
          <span
            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            {filteredFuelCards.length} di {fuelCards.length} fuel cards
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
        >
          <thead className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <tr>
              <th className="w-10 px-4 py-3"></th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider`}
              >
                Targa
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
                Società
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider`}
              >
                Data Richiesta
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider`}
              >
                Alimentazione
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider`}
              >
                Stato
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } uppercase tracking-wider`}
              >
                Referente
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
            {filteredFuelCards.map((card) => (
              <tr
                key={card.id}
                className={
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedFuelCards.includes(card.id)}
                    onChange={() => onSelectFuelCard(card.id)}
                  />
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  {card.targa}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {card.nome_driver}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {card.societa}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {new Date(card.dataRichiesta).toLocaleDateString("it-IT")}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {card.alimentazione}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${card.stato === "Arrivata"
                      ? "bg-green-600 text-green-50"
                      : card.stato === "In attesa"
                        ? "bg-yellow-500 text-yellow-50"
                        : "bg-red-600 text-red-50"
                      }`}
                  >
                    {card.stato}
                  </span>
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {card.referente}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => onEditFuelCard(card)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Modifica fuel card"
                    >
                      <Edit className="w-5 h-5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => onDeleteFuelCard(card.id)}
                      className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                        }`}
                      title="Elimina fuel card"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFuelCards.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className={`px-4 py-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Nessuna fuel card trovata con i filtri attuali
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelCardsTable;
