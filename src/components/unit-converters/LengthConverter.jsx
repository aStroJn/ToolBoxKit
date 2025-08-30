import { useState } from 'react';

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');

  // Conversion factors to meters
  const unitsToMeter = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mile: 1609.34,
    foot: 0.3048,
    inch: 0.0254
  };

  const convert = () => {
    if (!inputValue) return '';
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    // Convert to meters first, then to target unit
    const valueInMeters = value * unitsToMeter[fromUnit];
    const result = valueInMeters / unitsToMeter[toUnit];
    
    return result.toFixed(6);
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Length Converter
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
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
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="m">Meter (m)</option>
              <option value="km">Kilometer (km)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="mm">Millimeter (mm)</option>
              <option value="mile">Mile</option>
              <option value="foot">Foot</option>
              <option value="inch">Inch</option>
            </select>
          </div>
        </div>

        {/* Output Section */}
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
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="m">Meter (m)</option>
              <option value="km">Kilometer (km)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="mm">Millimeter (mm)</option>
              <option value="mile">Mile</option>
              <option value="foot">Foot</option>
              <option value="inch">Inch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LengthConverter;