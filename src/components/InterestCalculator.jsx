import { useState, useEffect } from 'react';

const InterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interestType, setInterestType] = useState('simple');
  const [result, setResult] = useState(null);

  // Calculate interest based on type
  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (!p || !r || !t) {
      setResult(null);
      return;
    }

    if (interestType === 'simple') {
      const interest = (p * r * t) / 100;
      const totalAmount = p + interest;
      setResult({
        interest: interest.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      });
    } else {
      // Compound interest calculation
      const amount = p * Math.pow(1 + (r / 100), t);
      const interest = amount - p;
      setResult({
        interest: interest.toFixed(2),
        totalAmount: amount.toFixed(2)
      });
    }
  };

  // Handle input changes and recalculate
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value === '' ? '' : value);
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, interestType]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      {/* Interest Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interest Type
        </label>
        <div className="flex space-x-4">
          {['simple', 'compound'].map((type) => (
            <button
              key={type}
              onClick={() => setInterestType(type)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                interestType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Principal Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={handleInputChange(setPrincipal)}
            placeholder="Enter principal amount"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={handleInputChange(setRate)}
            placeholder="Enter interest rate"
            step="0.1"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Period (Years)
          </label>
          <input
            type="number"
            value={time}
            onChange={handleInputChange(setTime)}
            placeholder="Enter time in years"
            step="0.1"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Calculation Results
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Principal:</span>
              <span className="font-mono text-gray-900 dark:text-white">₹{principal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Interest Earned:</span>
              <span className="font-mono text-green-600 dark:text-green-400">₹{result.interest}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-300 dark:border-gray-600">
              <span className="text-gray-900 dark:text-white">Total Amount:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">₹{result.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default InterestCalculator;