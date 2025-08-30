import { useState } from 'react';
import UnitConverterTabs from '../components/unit-converters/UnitConverterTabs';
import LengthConverter from '../components/unit-converters/LengthConverter';
import MassConverter from '../components/unit-converters/MassConverter';
import TimeConverter from '../components/unit-converters/TimeConverter';
import TemperatureConverter from '../components/unit-converters/TemperatureConverter';
import CurrentConverter from '../components/unit-converters/CurrentConverter';
import SubstanceConverter from '../components/unit-converters/SubstanceConverter';
import LuminousConverter from '../components/unit-converters/LuminousConverter';

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('length');

  const renderConverter = () => {
    switch (activeTab) {
      case 'length':
        return <LengthConverter />;
      case 'mass':
        return <MassConverter />;
      case 'time':
        return <TimeConverter />;
      case 'temperature':
        return <TemperatureConverter />;
      case 'current':
        return <CurrentConverter />;
      case 'substance':
        return <SubstanceConverter />;
      case 'luminous':
        return <LuminousConverter />;
      default:
        return <LengthConverter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Unit Converter
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