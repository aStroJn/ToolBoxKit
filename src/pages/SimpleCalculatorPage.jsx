import SimpleCalculator from '../components/SimpleCalculator';

const SimpleCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Simple Calculator
        </h1>
        <SimpleCalculator />
      </div>
    </div>
  );
};

export default SimpleCalculatorPage;