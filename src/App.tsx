import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import SimplexSolver from './components/SimplexSolver';
import ProblemInput from './components/ProblemInput';

function App() {
  const [problem, setProblem] = useState({
    objective: [],
    constraints: [],
    type: 'max'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold text-gray-900">Linear Programming Solver</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProblemInput onProblemChange={setProblem} />
        <SimplexSolver problem={problem} />
      </main>
    </div>
  );
}

export default App;