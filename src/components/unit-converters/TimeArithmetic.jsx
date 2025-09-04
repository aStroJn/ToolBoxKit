import { useState } from 'react';

const TimeArithmetic = () => {
    const [time1, setTime1] = useState({ value: '', unit: 'hour' });
    const [time2, setTime2] = useState({ value: '', unit: 'minute' });
    const [operation, setOperation] = useState('add');
    const [result, setResult] = useState('');

    const unitsToSecond = {
        hour: 3600,
        minute: 60,
        second: 1,
        day: 86400,
        week: 604800
    };

    const calculate = () => {
        const val1 = parseFloat(time1.value) || 0;
        const val2 = parseFloat(time2.value) || 0;

        const seconds1 = val1 * unitsToSecond[time1.unit];
        const seconds2 = val2 * unitsToSecond[time2.unit];

        let totalSeconds;
        if (operation === 'add') {
            totalSeconds = seconds1 + seconds2;
        } else {
            totalSeconds = seconds1 - seconds2;
        }

        // Convert back to the first unit for display
        const resultValue = totalSeconds / unitsToSecond[time1.unit];
        setResult(resultValue.toFixed(6));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Time Arithmetic Calculator
            </h3>

            <div className="space-y-4">
                {/* Time 1 Input */}
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={time1.value}
                        onChange={(e) => setTime1({ ...time1, value: e.target.value })}
                        placeholder="0"
                        className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                        value={time1.unit}
                        onChange={(e) => setTime1({ ...time1, unit: e.target.value })}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="hour">Hours</option>
                        <option value="minute">Minutes</option>
                        <option value="second">Seconds</option>
                        <option value="day">Days</option>
                        <option value="week">Weeks</option>
                    </select>
                </div>

                {/* Operation */}
                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="add"
                            checked={operation === 'add'}
                            onChange={() => setOperation('add')}
                            className="mr-2"
                        />
                        Add (+)
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="subtract"
                            checked={operation === 'subtract'}
                            onChange={() => setOperation('subtract')}
                            className="mr-2"
                        />
                        Subtract (-)
                    </label>
                </div>

                {/* Time 2 Input */}
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={time2.value}
                        onChange={(e) => setTime2({ ...time2, value: e.target.value })}
                        placeholder="0"
                        className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                        value={time2.unit}
                        onChange={(e) => setTime2({ ...time2, unit: e.target.value })}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="hour">Hours</option>
                        <option value="minute">Minutes</option>
                        <option value="second">Seconds</option>
                        <option value="day">Days</option>
                        <option value="week">Weeks</option>
                    </select>
                </div>

                <button
                    onClick={calculate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    Calculate
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Result:</h4>
                        <p className="text-lg">{result} {time1.unit}s</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeArithmetic;