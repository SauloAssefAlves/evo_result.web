import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  columns: string[];
  data: any[];
}

export default function Table({ columns, data }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Cálculo da paginação
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <div className="w-full flex flex-col">
        {/* Cabeçalho */}
        <div className="flex bg-neutral text-white font-semibold text-lg">
          {columns.map((col, index) => (
            <div
              key={index}
              className={`p-2 flex-1 min-w-[${
                100 / columns.length
              }%] text-center`}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Corpo */}
        <div className="flex flex-col border border-gray-200">
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex hover:bg-gray-300 group border-b"
              >
                {columns.map((col, colIndex) => (
                  <div
                    key={colIndex}
                    className={`p-2 flex-1 min-w-[${
                      100 / columns.length
                    }%] text-center flex items-center justify-center `}
                  >
                    {row[col]}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FaChevronLeft />
            </button>
            <span className="font-semibold text-lg">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
