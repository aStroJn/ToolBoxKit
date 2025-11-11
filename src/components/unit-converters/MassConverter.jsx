import { useState, useMemo } from 'react';

const MassConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('g');

  // Conversion factors to kilograms (base unit)
  const unitsToKg = {
    // Metric units
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    'metric-ton': 1000,

    // Imperial units
    'long-ton': 1016.047,
    'short-ton': 907.18474,
    pound: 0.45359237,
    ounce: 0.028349523125,

    // Special units
    carrat: 0.0002,
    'atomic-mass-unit': 1.66053906660e-27
  };

  // Unit labels for display
  const unitLabels = {
    kg: 'Kilogram (kg)',
    g: 'Gram (g)',
    mg: 'Milligram (mg)',
    'metric-ton': 'Metric Ton',
    'long-ton': 'Long Ton',
    'short-ton': 'Short Ton',
    pound: 'Pound (lb)',
    ounce: 'Ounce (oz)',
    carrat: 'Carrat',
    'atomic-mass-unit': 'Atomic Mass Unit (u)'
  };

  // Conversion formulas
  const conversionFormulas = {
    // Metric to Metric
    'kg-g': { formula: 'g = kg × 1000', example: '1 kg = 1000 g' },
    'kg-mg': { formula: 'mg = kg × 1,000,000', example: '1 kg = 1,000,000 mg' },
    'kg-metric-ton': { formula: 'metric-ton = kg ÷ 1000', example: '1000 kg = 1 metric ton' },

    // Metric to Imperial
    'kg-pound': { formula: 'pound = kg × 2.20462', example: '1 kg ≈ 2.20462 pounds' },
    'kg-ounce': { formula: 'ounce = kg × 35.274', example: '1 kg ≈ 35.274 ounces' },

    // Imperial to Metric
    'pound-kg': { formula: 'kg = pound ÷ 2.20462', example: '2.20462 pounds = 1 kg' },
    'ounce-kg': { formula: 'kg = ounce ÷ 35.274', example: '35.274 ounces = 1 kg' },

    // Imperial to Imperial
    'pound-ounce': { formula: 'ounce = pound × 16', example: '1 pound = 16 ounces' },
    'long-ton-short-ton': { formula: 'short-ton = long-ton × 1.12', example: '1 long ton = 1.12 short tons' },

    // Special units
    'kg-carrat': { formula: 'carrat = kg × 5000', example: '1 kg = 5000 carrats' },
    'kg-atomic-mass-unit': { formula: 'u = kg ÷ 1.66053906660 × 10⁻²⁷', example: '1 kg ≈ 6.022 × 10²⁶ u' },

    // Same unit conversion
    'kg-kg': { formula: 'kg = kg', example: 'No conversion needed' },
    'g-g': { formula: 'g = g', example: 'No conversion needed' },
  };

  const convert = () => {
    if (!inputValue) return '';

    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    // Convert to kilograms first, then to target unit
    const valueInKg = value * unitsToKg[fromUnit];
    const result = valueInKg / unitsToKg[toUnit];

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
    const fromFactor = unitsToKg[fromUnit];
    const toFactor = unitsToKg[toUnit];
    const conversionFactor = fromFactor / toFactor;

    return {
      formula: `${toUnit} = ${fromUnit} × ${conversionFactor.toExponential(6)}`,
      example: `1 ${fromUnit} = ${conversionFactor.toExponential(6)} ${toUnit}`
    };
  }, [fromUnit, toUnit, conversionFormulas, unitsToKg]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Mass Calculator
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

            {/* From Unit Selection - Always Open Dropdown */}
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

          {/* To Unit Selection - Always Open Dropdown */}
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
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
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
              1 {fromUnit} = {(unitsToKg[fromUnit] / unitsToKg[toUnit]).toExponential(6)} {toUnit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassConverter;