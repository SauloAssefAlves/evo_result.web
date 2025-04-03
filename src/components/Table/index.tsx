/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  columns: string[];
  data: any[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <div className="w-full flex flex-col">
        {/* Cabeçalho */}
        <div className="flex bg-neutral text-white font-semibold text-lg">
          {columns.map((col, index) => (
            <div
              key={index}
              className={`p-4 flex-1 min-w-[${
                100 / columns.length
              }%] text-center`}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Corpo */}
        <div className="flex flex-col border border-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex hover:bg-gray-300 group border-b"
              >
                {columns.map((col, colIndex) => (
                  <div
                    key={colIndex}
                    className={`p-4 flex-1 min-w-[${
                      100 / columns.length
                    }%] text-center`}
                  >
                    {row[col]}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-6 text-gray-500 text-center">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
