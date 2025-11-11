import { useState } from 'react';

const TimeExpression = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  // Safe expression evaluator for time calculations
  const safeEval = (expression) => {
    // Only allow numbers, basic operators, and decimal points
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    if (sanitized !== expression) {
      throw new Error('Invalid characters in expression');
    }
    
    // Create a function that only allows mathematical operations
    const calculate = new Function('return ' + sanitized);
    return calculate();
  };

  const evaluateExpression = () => {
    try {
      // Simple expression evaluator for time calculations
      const cleanExpr = expression
        .replace(/hours?/gi, '*3600')
        .replace(/minutes?/gi, '*60')
        .replace(/seconds?/gi, '*1')
        .replace(/days?/gi, '*86400')
        .replace(/weeks?/gi, '*604800')
        .replace(/\s+/g, '')
        .replace(/\\-/g, '-')
        .replace(/\*/g, ' * ')
        .replace(/\//g, ' / ');

      const totalSeconds = safeEval(cleanExpr);
      // Use Function constructor instead of eval for safer evaluation
      const totalSeconds = new Function('return ' + cleanExpr)();
      
      // Convert to readable format
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setResult(`${days}d ${hours}h ${minutes}m ${seconds.toFixed(0)}s`);
    } catch {
      setResult('Invalid expression');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Time Expression Calculator
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Expression (e.g., "2 hours + 30 minutes")
          </label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="2 hours + 30 minutes"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={evaluateExpression}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">Result:</h4>
            <p className="text-lg">{result}</p>
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Supported formats: hours, minutes, seconds, days, weeks</p>
          <p>Example: "2 hours + 30 minutes - 45 seconds"</p>
        </div>
      </div>
    </div>
  );
};

export default TimeExpression;