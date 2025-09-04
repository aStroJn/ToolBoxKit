import { useState } from 'react';

const DateCalculator = () => {
    const [startDate, setStartDate] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [timeUnit, setTimeUnit] = useState('days');
    const [operation, setOperation] = useState('add');
    const [result, setResult] = useState('');

    const calculateDate = () => {
        if (!startDate) return;

        const date = new Date(startDate);
        const value = parseInt(timeValue) || 0;

        if (operation === 'add') {
            if (timeUnit === 'days') date.setDate(date.getDate() + value);
            if (timeUnit === 'hours') date.setHours(date.getHours() + value);
            if (timeUnit === 'minutes') date.setMinutes(date.getMinutes() + value);
        } else {
            if (timeUnit === 'days') date.setDate(date.getDate() - value);
            if (timeUnit === 'hours') date.setHours(date.getHours() - value);
            if (timeUnit === 'minutes') date.setMinutes(date.getMinutes() - value);
        }

        setResult(date.toLocaleString());
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Date Calculator
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                        placeholder="0"
                        className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="days">Days</option>
                        <option value="hours">Hours</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="add"
                            checked={operation === 'add'}
                            onChange={() => setOperation('add')}
                            className="mr-2"
                        />
                        Add
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="subtract"
                            checked={operation === 'subtract'}
                            onChange={() => setOperation('subtract')}
                            className="mr-2"
                        />
                        Subtract
                    </label>
                </div>

                <button
                    onClick={calculateDate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    Calculate
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Result:</h4>
                        <p className="text-lg">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateCalculator;