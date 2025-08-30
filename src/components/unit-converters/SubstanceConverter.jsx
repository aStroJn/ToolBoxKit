import { useState } from 'react';

const SubstanceConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mol');
  const [toUnit, setToUnit] = useState('μmol');

  // Conversion factors to moles
  const unitsToMol = {
    mol: 1,
    μmol: 0.000001
  };

  const convert = () => {
    if (!inputValue) return '';
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    const valueInMol = value * unitsToMol[fromUnit];
    const result = valueInMol / unitsToMol[toUnit];
    
    return result.toFixed(6);
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Amount of Substance Converter
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
              <option value="mol">Mole (mol)</option>
              <option value="μmol">Micromole (μmol)</option>
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
              <option value="mol">Mole (mol)</option>
              <option value="μmol">Micromole (μmol)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubstanceConverter;