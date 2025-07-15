import { useEffect, useState, useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

/* eslint-disable @typescript-eslint/no-explicit-any */

type SortType = "string" | "number" | "date" | "datetime" | "boolean";

interface ColumnConfig {
  name: string;
  sortType?: SortType;
  sortable?: boolean;
}

interface TableProps {
  columns: (string | ColumnConfig)[];
  data: any[];
}

type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  column: string | null;
  direction: SortDirection;
}

function formatarTexto(texto: string) {
  return texto
    .normalize("NFD") // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/ç/gi, "c") // Substitui ç/Ç por c/C (case-insensitive)
    .replace(/\s+/g, ""); // Remove TODOS os espaços
}

// Funções auxiliares para lidar com colunas
function getColumnName(column: string | ColumnConfig): string {
  return typeof column === "string" ? column : column.name;
}

function getColumnSortType(column: string | ColumnConfig): SortType {
  return typeof column === "string" ? "string" : column.sortType || "string";
}

function isColumnSortable(column: string | ColumnConfig): boolean {
  return typeof column === "string" ? true : column.sortable !== false;
}

// Função para converter valores baseado no tipo
function convertValueForSort(value: any, sortType: SortType): any {
  // Função auxiliar para parser de datas brasileiras
  const parseDate = (dateStr: string): Date => {
    if (!dateStr || typeof dateStr !== "string") {
      return new Date(dateStr);
    }

    // Tenta parser direto primeiro
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // Parser para formato brasileiro: dd/mm/yyyy ou dd/mm/yyyy hh:mm
    const brazilianDateRegex =
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
    const match = dateStr.match(brazilianDateRegex);

    if (match) {
      const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
        match;
      // Mês é 0-indexado no JavaScript
      date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      return date;
    }

    // Parser para outros formatos comuns
    // dd-mm-yyyy ou dd-mm-yyyy hh:mm
    const dashDateRegex =
      /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
    const dashMatch = dateStr.match(dashDateRegex);

    if (dashMatch) {
      const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
        dashMatch;
      date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      return date;
    }

    // Se nenhum parser funcionou, retorna data inválida
    return new Date(NaN);
  };

  switch (sortType) {
    case "number":
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    case "date":
      // Para datas sem hora específica (apenas data)
      // Se valor é null/undefined, retorna a menor data possível
      if (value === null || value === undefined || value === "") {
        return new Date(0); // 1970-01-01 (menor valor padrão)
      }

      const date = parseDate(value);
      if (!isNaN(date.getTime())) {
        // Zera a hora para comparar apenas a data
        date.setHours(0, 0, 0, 0);
        return date;
      }
      return new Date(0);
    case "datetime":
      // Para data e hora completa
      // Se valor é null/undefined, retorna a menor data possível
      console.log("Datetime value:", value);
      if (value === null || value === undefined || value === "") {
        return new Date(0); // 1970-01-01 00:00:00 (menor valor padrão)
      }

      const datetime = parseDate(value);
      if (!isNaN(datetime.getTime())) {
        return datetime;
      }
      console.warn("Failed to parse datetime:", value);
      return new Date(0);
    case "boolean":
      if (typeof value === "boolean") return value;
      // Check if value is a React element (like FaCheck or ImCross icons)

      if (typeof value === "string") {
        const lower = value.toLowerCase();
        return (
          lower === "true" ||
          lower === "sim" ||
          lower === "yes" ||
          lower === "1"
        );
      }
      console.log(value);
      if (value.type.name === "FaCheck" || value.type.name === "ImCross") {
        return value.type.name === "FaCheck";
      }
      return Boolean(value);
    case "string":
    default:
      return String(value || "").toLowerCase();
  }
}

export default function Table({ columns, data }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: null,
  });
  const rowsPerPage = 20;

  useEffect(() => {
    // Resetar a página atual para 1 quando os dados mudarem
    setCurrentPage(1);
  }, [data]);

  // Função para lidar com a ordenação
  const handleSort = (column: string | ColumnConfig) => {
    const columnName = getColumnName(column);
    let direction: SortDirection = "asc";
    if (sortConfig.column === columnName && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (
      sortConfig.column === columnName &&
      sortConfig.direction === "desc"
    ) {
      direction = null;
    }
    setSortConfig({ column: direction ? columnName : null, direction });
    setCurrentPage(1); // Reset para a primeira página ao ordenar
  };

  // Função para ordenar os dados
  const sortedData = useMemo(() => {
    if (!sortConfig.column || !sortConfig.direction) {
      return data;
    }

    const columnKey = formatarTexto(sortConfig.column);
    const column = columns.find(
      (col) => getColumnName(col) === sortConfig.column
    );
    const sortType = column ? getColumnSortType(column) : "string";

    return [...data].sort((a, b) => {
      const aValue = convertValueForSort(a[columnKey], sortType);
      const bValue = convertValueForSort(b[columnKey], sortType);

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, columns]);

  // Cálculo da paginação
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // Função para obter o ícone de ordenação
  const getSortIcon = (column: string | ColumnConfig) => {
    const columnName = getColumnName(column);
    if (sortConfig.column !== columnName) {
      return <FaSort className="opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <FaSortUp className="text-yellow-400" />;
    }
    if (sortConfig.direction === "desc") {
      return <FaSortDown className="text-yellow-400" />;
    }
    return <FaSort className="opacity-50" />;
  };

  return (
    <div className="rounded-lg shadow-md pb-10">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {" "}
          {/* Aumentei a largura mínima */}
          {/* Cabeçalho */}
          <div className="flex bg-neutral text-white font-bold text-sm rounded-t-lg ">
            {columns.map((col, index) => {
              const columnName = getColumnName(col);
              const isSortable = isColumnSortable(col);
              return (
                <div
                  key={index}
                  className={`p-3 text-center ${getColumnWidth(
                    columnName
                  )} flex items-center justify-center gap-2 ${
                    isSortable
                      ? "cursor-pointer hover:bg-neutral/80 transition-colors"
                      : "cursor-default"
                  }`}
                  onClick={isSortable ? () => handleSort(col) : undefined}
                >
                  <span>{columnName}</span>
                  {isSortable && getSortIcon(col)}
                </div>
              );
            })}
          </div>
          {/* Corpo */}
          <div className="flex flex-col border border-neutral text-xs font-semibold">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex hover:bg-neutral/30 ${
                    rowIndex === currentData.length - 1
                      ? ""
                      : "border-b border-neutral"
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const columnName = getColumnName(col);
                    return (
                      <div
                        key={colIndex}
                        className={`p-3 text-center ${getColumnWidth(
                          columnName
                        )} flex items-center justify-center`}
                      >
                        {formatCellContent(row[formatarTexto(columnName)])}{" "}
                        {/* Função para formatar conteúdo */}
                      </div>
                    );
                  })}
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
      <div className="bg-neutral h-10 rounded-b-lg flex justify-center items-center gap-4 p-4 w-full">
        <div className="bg-neutral h-10 rounded-b-lg flex justify-center items-center gap-4 p-4 w-full">
          <div className="flex justify-between items-center w-full">
            {/* Botões e paginação centralizados */}
            <div className="flex justify-center items-center flex-1">
              {totalPages > 1 && (
                <>
                  {currentPage > 1 ? (
                    <button
                      className="btn btn-sm ring-1 ring-neutral text-base-content hover:bg-yellow-500 hover:text-black"
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
                      className="btn btn-sm ring-1 ring-neutral text-base-content hover:bg-yellow-500 hover:text-black"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <FaChevronRight />
                    </button>
                  ) : (
                    <div className="w-8" />
                  )}
                </>
              )}
            </div>
            {/* Span "Olho" alinhado à direita */}
            <span className="text-white text-sm ml-4 flex items-center gap-1">
              <FaEye /> {currentData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Função para determinar larguras específicas
function getColumnWidth(columnName: string): string {
  const widths: Record<string, string> = {
    Telefone: "w-[150px]",
    Anúncio: "w-[120px]",
    Campanha: "w-[180px]",
    Conjunto: "w-[150px]",
    Origem: "w-[120px]",
    Mídia: "w-[100px]",
    Data: "w-[120px]",
    Integrado: "w-[120px]",
    Criação: "w-[120px]",
  };
  return widths[columnName] || "flex-1";
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
