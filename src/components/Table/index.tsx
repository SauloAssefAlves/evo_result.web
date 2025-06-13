import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  columns: string[];
  data: any[];
}

function formatarTexto(texto: string) {
  return texto
    .normalize("NFD") // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/ç/gi, "c") // Substitui ç/Ç por c/C (case-insensitive)
    .replace(/\s+/g, ""); // Remove TODOS os espaços
}

export default function Table({ columns, data }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Cálculo da paginação
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="rounded-lg shadow-md pb-10">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {" "}
          {/* Aumentei a largura mínima */}
          {/* Cabeçalho */}
          <div className="flex bg-neutral text-white font-semibold text-lg">
            {columns.map((col, index) => (
              <div
                key={index}
                className={`p-3 text-center ${getColumnWidth(col)}`}
              >
                {col} {/* Nome da coluna */}
              </div>
            ))}
          </div>
          {/* Corpo */}
          <div className="flex flex-col border border-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex hover:bg-gray-100 ${
                    rowIndex === currentData.length - 1 ? "" : "border-b"
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className={`p-3 text-center ${getColumnWidth(
                        col
                      )} flex items-center justify-center`}
                    >
                      {formatCellContent(row[formatarTexto(col)])}{" "}
                      {/* Função para formatar conteúdo */}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center min-w-full">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer (paginação) */}
      <div className="bg-black h-10 rounded-b-lg flex justify-center items-center gap-4 p-4 w-full">
        <div className="bg-black h-10 rounded-b-lg flex justify-center items-center gap-4 p-4 w-full">
          {totalPages > 1 && (
            <div className="flex justify-center items-center w-full">
              {currentPage > 1 ? (
                <button
                  className="btn btn-sm glass text-white hover:bg-yellow-500 hover:text-black"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <FaChevronLeft />
                </button>
              ) : (
                <div className="w-9" />
              )}
              <span className="font-semibold text-lg text-white mx-6">
                {currentPage} de {totalPages}
              </span>
              {currentPage < totalPages ? (
                <button
                  className="btn btn-sm glass text-white hover:bg-yellow-500 hover:text-black"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <FaChevronRight />
                </button>
              ) : (
                <div className="w-8" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Função para determinar larguras específicas
function getColumnWidth(columnName: string): string {
  const widths: Record<string, string> = {
    'Telefone': 'w-[150px]',
    'Anúncio': 'w-[120px]',
    'Campanha': 'w-[180px]',
    'Conjunto': 'w-[150px]',
    'Origem': 'w-[120px]',
    'Mídia': 'w-[100px]',
    'Data': 'w-[120px]',
    'Integrado': 'w-[120px]',
    'Criação': 'w-[120px]'
  };
  return widths[columnName] || 'flex-1';
}

// Função para formatar conteúdo complexo
function formatCellContent(content: any): React.ReactNode {
  if (Array.isArray(content)) {
    return (
      <div className="flex flex-col gap-1">
        {content.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    );
  }
  return content;
}