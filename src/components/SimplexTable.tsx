import React from 'react';

interface SimplexTableProps {
  iteration: number;
  table: any;
  isLast: boolean;
}

export default function SimplexTable({ iteration, table, isLast }: SimplexTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {iteration === 0 ? 'Initial Tableau' : `Iteration ${iteration}`}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Basic</th>
              {table.matrix[0].map((_: any, i: number) => (
                <th
                  key={i}
                  className={`px-4 py-2 text-left ${
                    table.pivotCol === i ? 'bg-yellow-100' : ''
                  }`}
                >
                  {table.headers[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.matrix.map((row: number[], i: number) => (
              <tr
                key={i}
                className={table.pivotRow === i ? 'bg-yellow-100' : ''}
              >
                <td className="px-4 py-2">{table.basicVariables[i]}</td>
                {row.map((cell: number, j: number) => (
                  <td
                    key={j}
                    className={`px-4 py-2 ${
                      table.pivotRow === i && table.pivotCol === j
                        ? 'bg-yellow-200'
                        : ''
                    }`}
                  >
                    {cell.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLast && table.pivotRow !== undefined && (
        <div className="mt-4 text-gray-600">
          Pivot element: ({table.pivotRow + 1}, {table.pivotCol + 1})
        </div>
      )}
    </div>
  );
}