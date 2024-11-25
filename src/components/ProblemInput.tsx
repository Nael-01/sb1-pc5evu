import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface ProblemInputProps {
  onProblemChange: (problem: any) => void;
}

export default function ProblemInput({ onProblemChange }: ProblemInputProps) {
  const [variables, setVariables] = useState(2);
  const [constraints, setConstraints] = useState([
    { coefficients: [0, 0], sign: '≤', rhs: 0 }
  ]);
  const [objective, setObjective] = useState([0, 0]);
  const [type, setType] = useState('max');

  const updateObjective = (index: number, value: number) => {
    const newObjective = [...objective];
    newObjective[index] = value;
    setObjective(newObjective);
    updateProblem(newObjective, constraints, type);
  };

  const updateConstraint = (row: number, col: number, value: number) => {
    const newConstraints = [...constraints];
    newConstraints[row].coefficients[col] = value;
    setConstraints(newConstraints);
    updateProblem(objective, newConstraints, type);
  };

  const updateSign = (row: number, sign: string) => {
    const newConstraints = [...constraints];
    newConstraints[row].sign = sign;
    setConstraints(newConstraints);
    updateProblem(objective, newConstraints, type);
  };

  const updateRHS = (row: number, value: number) => {
    const newConstraints = [...constraints];
    newConstraints[row].rhs = value;
    setConstraints(newConstraints);
    updateProblem(objective, newConstraints, type);
  };

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { coefficients: Array(variables).fill(0), sign: '≤', rhs: 0 }
    ]);
  };

  const removeConstraint = (index: number) => {
    const newConstraints = constraints.filter((_, i) => i !== index);
    setConstraints(newConstraints);
    updateProblem(objective, newConstraints, type);
  };

  const updateProblem = (obj: number[], cons: any[], t: string) => {
    onProblemChange({
      objective: obj,
      constraints: cons,
      type: t
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Objective Function</h2>
        <div className="flex items-center space-x-4">
          <select 
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              updateProblem(objective, constraints, e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 rounded px-3 py-1"
          >
            <option value="max">Maximize</option>
            <option value="min">Minimize</option>
          </select>
          <div className="flex items-center space-x-2">
            {objective.map((coef, i) => (
              <React.Fragment key={i}>
                <input
                  type="number"
                  value={coef}
                  onChange={(e) => updateObjective(i, Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded px-2 py-1"
                />
                <span>x{i + 1}</span>
                {i < objective.length - 1 && <span>+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Constraints</h2>
        {constraints.map((constraint, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              {constraint.coefficients.map((coef: number, j: number) => (
                <React.Fragment key={j}>
                  <input
                    type="number"
                    value={coef}
                    onChange={(e) => updateConstraint(i, j, Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                  />
                  <span>x{j + 1}</span>
                  {j < constraint.coefficients.length - 1 && <span>+</span>}
                </React.Fragment>
              ))}
            </div>
            <select
              value={constraint.sign}
              onChange={(e) => updateSign(i, e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded px-3 py-1"
            >
              <option value="≤">≤</option>
              <option value="≥">≥</option>
              <option value="=">=</option>
            </select>
            <input
              type="number"
              value={constraint.rhs}
              onChange={(e) => updateRHS(i, Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => removeConstraint(i)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Minus size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={addConstraint}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
        >
          <Plus size={20} />
          <span>Add Constraint</span>
        </button>
      </div>
    </div>
  );
}