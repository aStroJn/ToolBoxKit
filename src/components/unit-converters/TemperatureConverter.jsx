import { useState } from 'react';

const TemperatureConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('K');
  const [toUnit, setToUnit] = useState('C');

  const convert = () => {
    if (!inputValue) return '';
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    // Convert to Kelvin first
    let valueInKelvin;
    switch (fromUnit) {
      case 'K':
        valueInKelvin = value;
        break;
      case 'C':
        valueInKelvin = value + 273.15;
        break;
      case 'F':
        valueInKelvin = (value - 32) * 5/9 + 273.15;
        break;
      default:
        valueInKelvin = value;
    }
    
    // Convert from Kelvin to target unit
    let result;
    switch (toUnit) {
      case 'K':
        result = valueInKelvin;
        break;
      case 'C':
        result = valueInKelvin - 273.15;
        break;
      case 'F':
        result = (valueInKelvin - 273.15) * 9/5 + 32;
        break;
      default:
        result = valueInKelvin;
    }
    
    return result.toFixed(6);
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Temperature Converter
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
              <option value="K">Kelvin (K)</option>
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
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
              <option value="K">Kelvin (K)</option>
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureConverter;