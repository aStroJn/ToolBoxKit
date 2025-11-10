import { useState } from 'react';

const FinancialCalculator = () => {
  const [activeTab, setActiveTab] = useState('compound-interest');
  
  // Compound Interest State
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compounds, setCompounds] = useState('12');
  const [compoundResult, setCompoundResult] = useState(null);
  
  // Simple Interest State
  const [simplePrincipal, setSimplePrincipal] = useState('');
  const [simpleRate, setSimpleRate] = useState('');
  const [simpleTime, setSimpleTime] = useState('');
  const [simpleResult, setSimpleResult] = useState(null);
  
  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loanResult, setLoanResult] = useState(null);
  
  // EMI Calculator State
  const [emiPrincipal, setEmiPrincipal] = useState('');
  const [emiRate, setEmiRate] = useState('');
  const [emiTerm, setEmiTerm] = useState('');
  const [emiResult, setEmiResult] = useState(null);

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compounds);
    
    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const A = P * Math.pow(1 + r/n, n*t);
    const interest = A - P;
    
    setCompoundResult({
      amount: A.toFixed(2),
      interest: interest.toFixed(2),
      total: A.toFixed(2)
    });
  };

  const calculateSimpleInterest = () => {
    const P = parseFloat(simplePrincipal);
    const r = parseFloat(simpleRate) / 100;
    const t = parseFloat(simpleTime);
    
    if (isNaN(P) || isNaN(r) || isNaN(t)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const SI = P * r * t;
    const amount = P + SI;
    
    setSimpleResult({
      interest: SI.toFixed(2),
      amount: amount.toFixed(2)
    });
  };

  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm) * 12;
    
    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = EMI * n;
    const totalInterest = totalAmount - P;
    
    setLoanResult({
      emi: EMI.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  const calculateEMI = () => {
    const P = parseFloat(emiPrincipal);
    const r = parseFloat(emiRate) / 100 / 12;
    const n = parseFloat(emiTerm) * 12;
    
    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = EMI * n;
    const totalInterest = totalAmount - P;
    
    setEmiResult({
      emi: EMI.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  const tabs = [
    { id: 'compound-interest', label: 'Compound Interest', icon: '📈' },
    { id: 'simple-interest', label: 'Simple Interest', icon: '💰' },
    { id: 'loan-calculator', label: 'Loan Calculator', icon: '🏦' },
    { id: 'emi-calculator', label: 'EMI Calculator', icon: '💳' }
  ];

  const renderCalculator = () => {
    switch (activeTab) {
      case 'compound-interest':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compound Interest Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Principal Amount ($)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time (years)
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compounds}
                  onChange={(e) => setCompounds(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>
            </div>
            <button
              onClick={calculateCompoundInterest}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calculate Compound Interest
            </button>
            {compoundResult && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Results:</h4>
                <div className="space-y-1 text-green-700 dark:text-green-300">
                  <p>Total Amount: <span className="font-semibold">${compoundResult.amount}</span></p>
                  <p>Interest Earned: <span className="font-semibold">${compoundResult.interest}</span></p>
                </div>
              </div>
            )}
          </div>
        );

      case 'simple-interest':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Simple Interest Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Principal ($)
                </label>
                <input
                  type="number"
                  value={simplePrincipal}
                  onChange={(e) => setSimplePrincipal(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate (% per year)
                </label>
                <input
                  type="number"
                  value={simpleRate}
                  onChange={(e) => setSimpleRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time (years)
                </label>
                <input
                  type="number"
                  value={simpleTime}
                  onChange={(e) => setSimpleTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10"
                />
              </div>
            </div>
            <button
              onClick={calculateSimpleInterest}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calculate Simple Interest
            </button>
            {simpleResult && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Results:</h4>
                <div className="space-y-1 text-green-700 dark:text-green-300">
                  <p>Interest: <span className="font-semibold">${simpleResult.interest}</span></p>
                  <p>Total Amount: <span className="font-semibold">${simpleResult.amount}</span></p>
                </div>
              </div>
            )}
          </div>
        );

      case 'loan-calculator':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="6.5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loan Term (years)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="30"
                />
              </div>
            </div>
            <button
              onClick={calculateLoan}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calculate Loan
            </button>
            {loanResult && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Results:</h4>
                <div className="space-y-1 text-green-700 dark:text-green-300">
                  <p>Monthly EMI: <span className="font-semibold">${loanResult.emi}</span></p>
                  <p>Total Interest: <span className="font-semibold">${loanResult.totalInterest}</span></p>
                  <p>Total Amount: <span className="font-semibold">${loanResult.totalAmount}</span></p>
                </div>
              </div>
            )}
          </div>
        );

      case 'emi-calculator':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">EMI Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interest Rate (% per month)
                </label>
                <input
                  type="number"
                  value={emiRate}
                  onChange={(e) => setEmiRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenure (months)
                </label>
                <input
                  type="number"
                  value={emiTerm}
                  onChange={(e) => setEmiTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="60"
                />
              </div>
            </div>
            <button
              onClick={calculateEMI}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calculate EMI
            </button>
            {emiResult && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Results:</h4>
                <div className="space-y-1 text-green-700 dark:text-green-300">
                  <p>Monthly EMI: <span className="font-semibold">${emiResult.emi}</span></p>
                  <p>Total Interest: <span className="font-semibold">${emiResult.totalInterest}</span></p>
                  <p>Total Amount: <span className="font-semibold">${emiResult.totalAmount}</span></p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Financial Calculator
      </h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
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

      {/* Calculator Content */}
      <div className="max-w-4xl mx-auto">
        {renderCalculator()}
      </div>
    </div>
  );
};

export default FinancialCalculator;
