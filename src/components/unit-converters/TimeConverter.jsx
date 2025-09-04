import { useState, useMemo } from 'react';

const TimeConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('second');
  const [toUnit, setToUnit] = useState('minute');

  // Conversion factors to seconds (base unit)
  const unitsToSecond = {
    // Large time units
    millennium: 31536000000, // 1000 years
    century: 3153600000,     // 100 years
    decade: 315360000,       // 10 years
    'year-average': 31556952, // average year (365.2425 days)
    'common-year': 31536000,  // 365 days
    'leap-year': 31622400,    // 366 days
    quarter: 7776000,        // 90 days
    month: 2628000,          // 30.44 days average
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
    millisecond: 0.001,
    microsecond: 0.000001,
    nanosecond: 0.000000001,
    picosecond: 0.000000000001
  };

  // Unit labels for display
  const unitLabels = {
    millennium: 'Millennium',
    century: 'Century',
    decade: 'Decade',
    'year-average': 'Year (Average)',
    'common-year': 'Common Year',
    'leap-year': 'Leap Year',
    quarter: 'Quarter',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    millisecond: 'Millisecond',
    microsecond: 'Microsecond',
    nanosecond: 'Nanosecond',
    picosecond: 'Picosecond'
  };

  const convert = () => {
    if (!inputValue) return '';

    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const valueInSeconds = value * unitsToSecond[fromUnit];
    const result = valueInSeconds / unitsToSecond[toUnit];

    if (Math.abs(result) < 0.000001) {
      return result.toExponential(6);
    } else if (Math.abs(result) > 1000000) {
      return result.toExponential(6);
    } else {
      return result.toFixed(10).replace(/\.?0+$/, '');
    }
  };

  const result = convert();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Time Unit Converter
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From {unitLabels[fromUnit]}
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
            </div>

            {/* From Unit Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Source Unit
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                {Object.entries(unitLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="fromUnit"
                      value={key}
                      checked={fromUnit === key}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>          
        </div>

        {/* To Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To {unitLabels[toUnit]}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={result}
                readOnly
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Target Unit
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                {Object.entries(unitLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="toUnit"
                      value={key}
                      checked={toUnit === key}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default TimeConverter;