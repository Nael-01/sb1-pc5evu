// Utility functions for the Simplex method
export function convertToStandardForm(problem: any) {
  const { objective, constraints, type } = problem;
  const numVars = objective.length;
  const numSlacks = constraints.length;
  
  // Convert minimization to maximization
  const objCoefficients = type === 'min' ? objective.map(c => -c) : [...objective];
  
  // Add slack variables
  const standardConstraints = constraints.map((constraint: any, i: number) => {
    const row = [...constraint.coefficients];
    // Add slack/surplus variables
    for (let j = 0; j < numSlacks; j++) {
      if (constraint.sign === '≤') {
        row.push(j === i ? 1 : 0);
      } else if (constraint.sign === '≥') {
        row.push(j === i ? -1 : 0);
      }
    }
    return {
      coefficients: row,
      rhs: constraint.rhs
    };
  });

  return {
    objective: objCoefficients,
    constraints: standardConstraints,
    numOriginalVars: numVars,
    numSlacks: numSlacks,
    type
  };
}

export function createInitialTable(standardForm: any) {
  const { objective, constraints, numOriginalVars, numSlacks } = standardForm;
  const totalVars = numOriginalVars + numSlacks;
  
  // Create headers
  const headers = [];
  for (let i = 0; i < numOriginalVars; i++) headers.push(`x${i + 1}`);
  for (let i = 0; i < numSlacks; i++) headers.push(`s${i + 1}`);
  headers.push('RHS');

  // Create matrix
  const matrix = constraints.map((constraint: any) => [
    ...constraint.coefficients,
    constraint.rhs
  ]);

  // Add objective row (z-row)
  const zRow = [...objective.map(c => -c)];
  for (let i = 0; i < numSlacks; i++) zRow.push(0);
  zRow.push(0); // RHS for z-row
  matrix.push(zRow);

  // Set initial basic variables
  const basicVariables = Array(constraints.length)
    .fill(0)
    .map((_, i) => `s${i + 1}`);
  basicVariables.push('z');

  return {
    matrix,
    headers,
    basicVariables
  };
}

export function isOptimal(table: any) {
  // Check if all coefficients in z-row are non-negative
  const zRow = table.matrix[table.matrix.length - 1];
  return zRow.slice(0, -1).every((coef: number) => coef >= -1e-10);
}

export function findPivotColumn(table: any) {
  const zRow = table.matrix[table.matrix.length - 1];
  let minVal = 0;
  let minIndex = -1;

  for (let i = 0; i < zRow.length - 1; i++) {
    if (zRow[i] < minVal) {
      minVal = zRow[i];
      minIndex = i;
    }
  }

  return minIndex;
}

export function findPivotRow(table: any, pivotCol: number) {
  let minRatio = Infinity;
  let pivotRow = -1;

  for (let i = 0; i < table.matrix.length - 1; i++) {
    const row = table.matrix[i];
    if (row[pivotCol] > 0) {
      const ratio = row[row.length - 1] / row[pivotCol];
      if (ratio < minRatio) {
        minRatio = ratio;
        pivotRow = i;
      }
    }
  }

  return pivotRow;
}

export function performPivot(table: any, pivotRow: number, pivotCol: number) {
  const newMatrix = table.matrix.map(row => [...row]);
  const pivotValue = newMatrix[pivotRow][pivotCol];

  // Normalize pivot row
  newMatrix[pivotRow] = newMatrix[pivotRow].map(val => val / pivotValue);

  // Update other rows
  for (let i = 0; i < newMatrix.length; i++) {
    if (i !== pivotRow) {
      const factor = newMatrix[i][pivotCol];
      newMatrix[i] = newMatrix[i].map((val, j) => 
        val - factor * newMatrix[pivotRow][j]
      );
    }
  }

  const newBasicVariables = [...table.basicVariables];
  newBasicVariables[pivotRow] = table.headers[pivotCol];

  return {
    ...table,
    matrix: newMatrix,
    basicVariables: newBasicVariables
  };
}

export function extractSolution(finalTable: any, standardForm: any) {
  const { numOriginalVars, type } = standardForm;
  const variables = Array(numOriginalVars).fill(0);
  
  // Extract values for each variable
  finalTable.basicVariables.forEach((varName: string, row: number) => {
    if (varName.startsWith('x')) {
      const varIndex = parseInt(varName.substring(1)) - 1;
      variables[varIndex] = finalTable.matrix[row][finalTable.matrix[row].length - 1];
    }
  });

  // Get optimal value
  const zRow = finalTable.matrix[finalTable.matrix.length - 1];
  let value = zRow[zRow.length - 1];
  
  // If it was a minimization problem, negate the result
  if (type === 'min') {
    value = -value;
  }

  return {
    variables,
    value
  };
}