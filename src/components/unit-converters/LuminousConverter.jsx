import { useState } from 'react';

const LuminousConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cd');
  const [toUnit, setToUnit] = useState('lumen');

  // Conversion factors (approximate)
  const unitsConversion = {
    cd: { lumen: 12.57, lux: 1 }, // 1 cd ≈ 12.57 lm, lux depends on distance
    lumen: { cd: 0.0796, lux: 0.0796 },
    lux: { cd: 1, lumen: 12.57 }
  };

  const convert = () => {
    if (!inputValue) return '';
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    if (fromUnit === toUnit) return value;
    
    const conversionFactor = unitsConversion[fromUnit]?.[toUnit];
    if (!conversionFactor) return 'N/A';
    
    const result = value * conversionFactor;
    return result.toFixed(6);
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Luminous Intensity Converter
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
              <option value="cd">Candela (cd)</option>
              <option value="lumen">Lumen</option>
              <option value="lux">Lux</option>
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
              <option value="cd">Candela (cd)</option>
              <option value="lumen">Lumen</option>
              <option value="lux">Lux</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Note: Luminous conversions are approximate and depend on specific conditions.</p>
        <p>1 cd ≈ 12.57 lm (for uniform spherical source)</p>
      </div>
    </div>
  );
};

export default LuminousConverter;