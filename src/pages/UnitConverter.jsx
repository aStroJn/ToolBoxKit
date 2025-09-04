import { useState } from 'react';
import UnitConverterTabs from '../components/unit-converters/UnitConverterTabs';
import LengthConverter from '../components/unit-converters/LengthConverter';
import MassConverter from '../components/unit-converters/MassConverter';
import TimeConverter from '../components/unit-converters/TimeConverter';
import TimeArithmetic from '../components/unit-converters/TimeArithmetic';
import DateCalculator from '../components/unit-converters/DateCalculator';
import TimeExpression from '../components/unit-converters/TimeExpression';
// ... other imports

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('length');
  const [timeSubTab, setTimeSubTab] = useState('converter');

  const renderConverter = () => {
    switch (activeTab) {
      case 'length':
        return <LengthConverter />;
      case 'mass':
        return <MassConverter />;
      case 'time':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 justify-center">
              {['converter', 'arithmetic', 'date', 'expression'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimeSubTab(tab)}
                  className={`px-4 py-2 rounded-lg ${
                    timeSubTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            {timeSubTab === 'converter' && <TimeConverter />}
            {timeSubTab === 'arithmetic' && <TimeArithmetic />}
            {timeSubTab === 'date' && <DateCalculator />}
            {timeSubTab === 'expression' && <TimeExpression />}
          </div>
        );
      // ... other cases
      default:
        return <LengthConverter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Unit Calculator
        </h1>
        
        <UnitConverterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="max-w-4xl mx-auto">
          {renderConverter()}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;