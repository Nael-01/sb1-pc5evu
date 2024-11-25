import React, { useState } from 'react';
import { Play } from 'lucide-react';
import SimplexTable from './SimplexTable';
import {
  convertToStandardForm,
  createInitialTable,
  isOptimal,
  findPivotColumn,
  findPivotRow,
  performPivot,
  extractSolution
} from '../utils/simplexMethods';

interface SimplexSolverProps {
  problem: {
    objective: number[];
    constraints: any[];
    type: string;
  };
}

export default function SimplexSolver({ problem }: SimplexSolverProps) {
  const [tables, setTables] = useState<any[]>([]);
  const [solution, setSolution] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const solve = () => {
    try {
      // Reset previous results
      setError(null);
      setTables([]);
      setSolution(null);

      // Validate input
      if (!problem.objective.length || !problem.constraints.length) {
        throw new Error('Please define the objective function and constraints');
      }

      // Convert problem to standard form
      const standardForm = convertToStandardForm(problem);
      
      // Initialize first simplex table
      const initialTable = createInitialTable(standardForm);
      const allTables = [initialTable];

      // Perform simplex iterations
      let currentTable = initialTable;
      let iteration = 0;
      const maxIterations = 100;

      while (!isOptimal(currentTable) && iteration < maxIterations) {
        const pivotCol = findPivotColumn(currentTable);
        const pivotRow = findPivotRow(currentTable, pivotCol);
        
        if (pivotRow === -1) {
          throw new Error('Problem is unbounded');
        }

        currentTable = performPivot(currentTable, pivotRow, pivotCol);
        allTables.push({...currentTable, pivotRow, pivotCol});
        iteration++;
      }

      if (iteration === maxIterations) {
        throw new Error('Maximum iterations reached');
      }

      setTables(allTables);
      setSolution(extractSolution(currentTable, standardForm));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={solve}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          <Play size={20} />
          <span>Solve</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded">
          {error}
        </div>
      )}

      {tables.map((table, i) => (
        <SimplexTable
          key={i}
          iteration={i}
          table={table}
          isLast={i === tables.length - 1}
        />
      ))}

      {solution && (
        <div className="bg-emerald-50 p-6 rounded">
          <h3 className="text-lg font-semibold mb-4">Optimal Solution</h3>
          <div className="space-y-2">
            <p>
              Optimal value: {solution.value.toFixed(2)}
            </p>
            <div>
              Variables:
              {solution.variables.map((value: number, i: number) => (
                <span key={i} className="ml-4">
                  x{i + 1} = {value.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}