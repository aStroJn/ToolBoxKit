import { useState } from 'react';

const MassConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('g');

  // Conversion factors to kilograms
  const unitsToKg = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495
  };

  const convert = () => {
    if (!inputValue) return '';
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    const valueInKg = value * unitsToKg[fromUnit];
    const result = valueInKg / unitsToKg[toUnit];
    
    return result.toFixed(6);
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Mass Converter
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="mg">Milligram (mg)</option>
              <option value="pound">Pound</option>
              <option value="ounce">Ounce</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={result}
              readOnly
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="mg">Milligram (mg)</option>
              <option value="pound">Pound</option>
              <option value="ounce">Ounce</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassConverter;