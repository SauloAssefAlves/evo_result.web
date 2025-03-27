/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  columns: string[];
  data: any[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md ">
      <table className="table w-full bg-white border border-gray-200">
        {/* Cabeçalho */}
        <thead>
          <tr className="bg-neutral text-white ">
            {columns.map((col, index) => (
              <th key={index} className="p-4  font-semibold text-lg">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Corpo */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-primary group border-b">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-4 text-gray-800 group-hover:text-secondary text-lg font-semibold"
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-500"
              >
                Nenhum dado disponível
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
