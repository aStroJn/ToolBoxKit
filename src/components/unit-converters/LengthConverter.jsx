import { useState, useMemo } from 'react';

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');

  // Conversion factors to meters (base unit)
  const unitsToMeter = useMemo(() => ({
    // Metric units
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    μm: 0.000001,  // Micrometer
    nm: 0.000000001, // Nanometer

    // Imperial units
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,

    // Astronomical units
    'light-year': 9460730472580800 // meters in one light year
  }), []);

  // Unit labels for display
  const unitLabels = useMemo(() => ({
    m: 'Meter (m)',
    km: 'Kilometer (km)',
    cm: 'Centimeter (cm)',
    mm: 'Millimeter (mm)',
    μm: 'Micrometer (μm)',
    nm: 'Nanometer (nm)',
    mile: 'Mile',
    yard: 'Yard',
    foot: 'Foot',
    inch: 'Inch',
    'light-year': 'Light Year'
  }), []);

  // Conversion formulas
  const conversionFormulas = useMemo(() => ({
    // Metric to Metric
    'm-km': { formula: 'km = m ÷ 1000', example: '1000 m = 1 km' },
    'm-cm': { formula: 'cm = m × 100', example: '1 m = 100 cm' },
    'm-mm': { formula: 'mm = m × 1000', example: '1 m = 1000 mm' },
    'm-μm': { formula: 'μm = m × 1,000,000', example: '1 m = 1,000,000 μm' },
    'm-nm': { formula: 'nm = m × 1,000,000,000', example: '1 m = 1,000,000,000 nm' },

    // Metric to Imperial
    'm-mile': { formula: 'mile = m ÷ 1609.344', example: '1609.344 m = 1 mile' },
    'm-yard': { formula: 'yard = m ÷ 0.9144', example: '0.9144 m = 1 yard' },
    'm-foot': { formula: 'foot = m ÷ 0.3048', example: '0.3048 m = 1 foot' },
    'm-inch': { formula: 'inch = m ÷ 0.0254', example: '0.0254 m = 1 inch' },

    // Imperial to Metric
    'mile-m': { formula: 'm = mile × 1609.344', example: '1 mile = 1609.344 m' },
    'yard-m': { formula: 'm = yard × 0.9144', example: '1 yard = 0.9144 m' },
    'foot-m': { formula: 'm = foot × 0.3048', example: '1 foot = 0.3048 m' },
    'inch-m': { formula: 'm = inch × 0.0254', example: '1 inch = 0.0254 m' },

    // Imperial to Imperial
    'mile-yard': { formula: 'yard = mile × 1760', example: '1 mile = 1760 yards' },
    'mile-foot': { formula: 'foot = mile × 5280', example: '1 mile = 5280 feet' },
    'yard-foot': { formula: 'foot = yard × 3', example: '1 yard = 3 feet' },
    'foot-inch': { formula: 'inch = foot × 12', example: '1 foot = 12 inches' },

    // Light year conversions
    'light-year-m': { formula: 'm = light-year × 9.46073 × 10¹⁵', example: '1 light-year ≈ 9.46 trillion meters' },
    'm-light-year': { formula: 'light-year = m ÷ 9.46073 × 10¹⁵', example: '9.46 trillion m = 1 light-year' },
    'light-year-km': { formula: 'km = light-year × 9.46073 × 10¹²', example: '1 light-year ≈ 9.46 trillion km' },

    // Same unit conversion
    'm-m': { formula: 'm = m', example: 'No conversion needed' },
    'km-km': { formula: 'km = km', example: 'No conversion needed' },
    // Add more same-unit conversions as needed
  }), []);

  const convert = () => {
    if (!inputValue) return '';

    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    // Convert to meters first, then to target unit
    const valueInMeters = value * unitsToMeter[fromUnit];
    const result = valueInMeters / unitsToMeter[toUnit];

    // Format result based on magnitude
    if (Math.abs(result) < 0.000001) {
      return result.toExponential(6);
    } else if (Math.abs(result) > 1000000) {
      return result.toExponential(6);
    } else {
      return result.toFixed(10).replace(/\.?0+$/, '');
    }
  };

  const result = convert();

  // Get current conversion formula
  const conversionFormula = useMemo(() => {
    const key = `${fromUnit}-${toUnit}`;
    if (conversionFormulas[key]) {
      return conversionFormulas[key];
    }

    // Generate formula for unknown conversions
    const fromFactor = unitsToMeter[fromUnit];
    const toFactor = unitsToMeter[toUnit];
    const conversionFactor = fromFactor / toFactor;

    return {
      formula: `${toUnit} = ${fromUnit} × ${conversionFactor.toExponential(6)}`,
      example: `1 ${fromUnit} = ${conversionFactor.toExponential(6)} ${toUnit}`
    };
  }, [fromUnit, toUnit, conversionFormulas, unitsToMeter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Length Calculator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
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
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
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
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
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

      {/* Formula Section */}
      <div className=" bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversion Formula
        </h4>

        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Conversion from {unitLabels[fromUnit]} to {unitLabels[toUnit]}
            </span>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg font-mono text-sm text-gray-900 dark:text-white">
              {conversionFormula.formula}
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Example
            </span>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg text-sm text-gray-900 dark:text-white">
              {conversionFormula.example}
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Conversion Factor
            </span>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg text-sm text-gray-900 dark:text-white">
              1 {fromUnit} = {(unitsToMeter[fromUnit] / unitsToMeter[toUnit]).toExponential(6)} {toUnit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LengthConverter;