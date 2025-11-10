import { useState } from 'react';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      case 'x²':
        return firstValue * firstValue;
      case 'x³':
        return firstValue * firstValue * firstValue;
      case 'xʸ':
        return Math.pow(firstValue, secondValue);
      case '√':
        return Math.sqrt(firstValue);
      case 'sin':
        return Math.sin(firstValue * Math.PI / 180);
      case 'cos':
        return Math.cos(firstValue * Math.PI / 180);
      case 'tan':
        return Math.tan(firstValue * Math.PI / 180);
      case 'log':
        return Math.log10(firstValue);
      case 'ln':
        return Math.log(firstValue);
      case '1/x':
        return 1 / firstValue;
      case 'π':
        return Math.PI;
      case 'e':
        return Math.E;
      default:
        return secondValue;
    }
  };

  const handleSpecialFunction = (func) => {
    const inputValue = parseFloat(display);
    let result;

    switch (func) {
      case 'x²':
        result = inputValue * inputValue;
        break;
      case 'x³':
        result = inputValue * inputValue * inputValue;
        break;
      case '√':
        result = Math.sqrt(inputValue);
        break;
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case '1/x':
        result = 1 / inputValue;
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    setDisplay(String(result));
  };

  const Button = ({ onClick, className = '', children, ...props }) => (
    <button
      onClick={onClick}
      className={`h-14 rounded-lg font-semibold text-white transition-all duration-150 
                 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Scientific Calculator
      </h3>
      
      {/* Display */}
      <div className="mb-4">
        <div className="bg-gray-900 text-white p-4 rounded-lg text-right text-2xl font-mono overflow-hidden">
          {display}
        </div>
      </div>

      {/* Scientific Functions Row 1 */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <Button onClick={() => handleSpecialFunction('sin')} className="bg-purple-600 hover:bg-purple-700">
          sin
        </Button>
        <Button onClick={() => handleSpecialFunction('cos')} className="bg-purple-600 hover:bg-purple-700">
          cos
        </Button>
        <Button onClick={() => handleSpecialFunction('tan')} className="bg-purple-600 hover:bg-purple-700">
          tan
        </Button>
        <Button onClick={() => handleSpecialFunction('log')} className="bg-purple-600 hover:bg-purple-700">
          log
        </Button>
      </div>

      {/* Scientific Functions Row 2 */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <Button onClick={() => handleSpecialFunction('ln')} className="bg-purple-600 hover:bg-purple-700">
          ln
        </Button>
        <Button onClick={() => handleSpecialFunction('√')} className="bg-purple-600 hover:bg-purple-700">
          √
        </Button>
        <Button onClick={() => handleSpecialFunction('x²')} className="bg-purple-600 hover:bg-purple-700">
          x²
        </Button>
        <Button onClick={() => handleSpecialFunction('x³')} className="bg-purple-600 hover:bg-purple-700">
          x³
        </Button>
      </div>

      {/* Main Calculator Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <Button onClick={clear} className="bg-red-500 hover:bg-red-600">
          C
        </Button>
        <Button onClick={() => handleSpecialFunction('1/x')} className="bg-blue-500 hover:bg-blue-600">
          1/x
        </Button>
        <Button onClick={() => performOperation('÷')} className="bg-gray-600 hover:bg-gray-700">
          ÷
        </Button>
        <Button onClick={() => performOperation('×')} className="bg-gray-600 hover:bg-gray-700">
          ×
        </Button>

        {/* Row 2 */}
        <Button onClick={() => inputNumber(7)} className="bg-gray-700 hover:bg-gray-600">
          7
        </Button>
        <Button onClick={() => inputNumber(8)} className="bg-gray-700 hover:bg-gray-600">
          8
        </Button>
        <Button onClick={() => inputNumber(9)} className="bg-gray-700 hover:bg-gray-600">
          9
        </Button>
        <Button onClick={() => performOperation('-')} className="bg-gray-600 hover:bg-gray-700">
          -
        </Button>

        {/* Row 3 */}
        <Button onClick={() => inputNumber(4)} className="bg-gray-700 hover:bg-gray-600">
          4
        </Button>
        <Button onClick={() => inputNumber(5)} className="bg-gray-700 hover:bg-gray-600">
          5
        </Button>
        <Button onClick={() => inputNumber(6)} className="bg-gray-700 hover:bg-gray-600">
          6
        </Button>
        <Button onClick={() => performOperation('+')} className="bg-gray-600 hover:bg-gray-700">
          +
        </Button>

        {/* Row 4 */}
        <Button onClick={() => inputNumber(1)} className="bg-gray-700 hover:bg-gray-600">
          1
        </Button>
        <Button onClick={() => inputNumber(2)} className="bg-gray-700 hover:bg-gray-600">
          2
        </Button>
        <Button onClick={() => inputNumber(3)} className="bg-gray-700 hover:bg-gray-600">
          3
        </Button>
        <Button 
          onClick={() => performOperation('=')} 
          className="bg-blue-500 hover:bg-blue-600 row-span-2"
        >
          =
        </Button>

        {/* Row 5 */}
        <Button onClick={() => inputNumber(0)} className="bg-gray-700 hover:bg-gray-600 col-span-2">
          0
        </Button>
        <Button onClick={inputDecimal} className="bg-gray-700 hover:bg-gray-600">
          .
        </Button>
      </div>
    </div>
  );
};

export default ScientificCalculator;
