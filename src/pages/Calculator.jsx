import { Link } from 'react-router-dom';
import ScientificCalculator from '../components/ScientificCalculator';
import FinancialCalculator from '../components/FinancialCalculator';
import { useState } from 'react';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tools = [
    { name: 'Simple Calculator', path: '/SimpleCalculatorPage', emoji: '📔', desc: 'Basic arithmetic operations' },
    { name: 'Interest Calculator', path: '/InterestCalculatorPage', emoji: '💰', desc: 'Calculate interest and returns' },
    { name: 'Unit Calculator', path: '/unit-converter', emoji: '📏', desc: 'Convert between different units' },
    { name: 'Scientific Calculator', id: 'scientific', emoji: '🔬', desc: 'Advanced mathematical functions' },
    { name: 'Financial Calculator', id: 'financial', emoji: '🏦', desc: 'Loans, EMI, and investments' },
  ];

  const tabs = [
    { id: 'overview', label: 'All Calculators', icon: '📊' },
    { id: 'scientific', label: 'Scientific', icon: '🔬' },
    { id: 'financial', label: 'Financial', icon: '🏦' }
  ];

  const renderContent = () => {
    if (activeTab === 'scientific') {
      return <ScientificCalculator />;
    }
    if (activeTab === 'financial') {
      return <FinancialCalculator />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {tool.path ? (
              <Link
                to={tool.path}
                className="block p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl mb-4 text-center">{tool.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                  {tool.desc}
                </p>
              </Link>
            ) : (
              <button
                onClick={() => setActiveTab(tool.id)}
                className="w-full p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl mb-4 text-center">{tool.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                  {tool.desc}
                </p>
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Calculators
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Calculator;