import { useState } from 'react';

const SimpleCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Safe expression evaluator
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

  // Handle number and operator button clicks
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        // Evaluate the expression safely
        const evalResult = safeEval(input);
        setResult(evalResult.toString());
        setInput(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      // Clear everything
      setInput('');
      setResult('');
    } else if (value === '←') {
      // Backspace functionality
      setInput(prev => prev.slice(0, -1));
    } else {
      // Append the value to current input
      setInput(prev => prev + value);
    }
  };

  // Calculator button layout
  const buttons = [
    ['(', ')', '%', '←'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0' , '.','+'],
    [ '=']
  ];

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      {/* Display Area */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="text-right text-2xl font-mono text-gray-800 dark:text-gray-200 min-h-8 break-all">
          {input || '0'}
        </div>
        <div className="text-right text-lg font-mono text-gray-600 dark:text-gray-400 min-h-6 mt-2">
          {result && `= ${result}`}
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((button) => (
          <button
            key={button}
            onClick={() => handleButtonClick(button)}
            className={`
              p-4 rounded-lg text-xl font-semibold transition-all duration-200
              ${button === '=' ? 'col-span-4' : ''}
              ${['+', '-', '*', '/', '%', '(', ')', '√'].includes(button) 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : button === '=' 
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : button === 'C' || button === '←'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200'
              }
            `}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimpleCalculator;