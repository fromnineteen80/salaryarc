import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IncomeHistoryRow, Education, YesNo } from '../../types/user';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';

interface Props {
  data: IncomeHistoryRow[];
  currentAge: number;
  onNext: (data: IncomeHistoryRow[]) => void;
  onBack: () => void;
}

export default function Step4IncomeHistory({ data, currentAge, onNext, onBack }: Props) {
  const [rows, setRows] = useState<IncomeHistoryRow[]>(
    data.length > 0 ? data : [{
      year: new Date().getFullYear(),
      location: '',
      zipCode: '',
      income: 0,
      householdGoal: 0,
      age: currentAge,
      married: 'no',
      children: 'no',
      education: 'bachelors'
    }]
  );

  const addRow = () => {
    if (rows.length < 15) {
      const lastRow = rows[rows.length - 1];
      setRows([...rows, {
        year: lastRow.year + 1,
        location: lastRow.location,
        zipCode: lastRow.zipCode,
        income: lastRow.income,
        householdGoal: lastRow.householdGoal,
        age: lastRow.age + 1,
        married: lastRow.married,
        children: lastRow.children,
        education: lastRow.education
      }]);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > 3) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof IncomeHistoryRow, value: any) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(rows);
  };

  const isValid = rows.length >= 3 &&
                  rows.every(r => r.year && r.location && r.zipCode && r.income > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Income Journey
        </h2>
        <p className="text-gray-600">
          Track your earning history to see your market value progression (3-15 years)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">Year</th>
                <th className="text-left p-3 font-semibold text-gray-700">Location</th>
                <th className="text-left p-3 font-semibold text-gray-700">ZIP</th>
                <th className="text-left p-3 font-semibold text-gray-700">Income</th>
                <th className="text-left p-3 font-semibold text-gray-700">Goal</th>
                <th className="text-left p-3 font-semibold text-gray-700">Age</th>
                <th className="text-left p-3 font-semibold text-gray-700">Married</th>
                <th className="text-left p-3 font-semibold text-gray-700">Kids</th>
                <th className="text-left p-3 font-semibold text-gray-700">Education</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {rows.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.year}
                        onChange={(e) => updateRow(index, 'year', parseInt(e.target.value))}
                        className="w-20 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        min="1960"
                        max={new Date().getFullYear() + 10}
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.location}
                        onChange={(e) => updateRow(index, 'location', e.target.value)}
                        className="w-32 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        placeholder="Austin, TX"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.zipCode}
                        onChange={(e) => updateRow(index, 'zipCode', e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        placeholder="78701"
                        pattern="[0-9]{5}"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.income}
                        onChange={(e) => updateRow(index, 'income', parseInt(e.target.value))}
                        className="w-28 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        placeholder="75000"
                        min="0"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.householdGoal}
                        onChange={(e) => updateRow(index, 'householdGoal', parseInt(e.target.value))}
                        className="w-28 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        placeholder="150000"
                        min="0"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.age}
                        onChange={(e) => updateRow(index, 'age', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none"
                        min="18"
                        max="100"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.married}
                        onChange={(e) => updateRow(index, 'married', e.target.value as YesNo)}
                        className="w-16 px-1 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none text-xs"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={row.children}
                        onChange={(e) => updateRow(index, 'children', e.target.value as YesNo)}
                        className="w-16 px-1 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none text-xs"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={row.education}
                        onChange={(e) => updateRow(index, 'education', e.target.value as Education)}
                        className="w-32 px-2 py-1 rounded border border-gray-300 focus:border-emerald-500 focus:outline-none text-xs"
                      >
                        <option value="less_hs">Less HS</option>
                        <option value="hs_grad">HS Grad</option>
                        <option value="trade">Trade</option>
                        <option value="associate">Associate</option>
                        <option value="some_college">Some College</option>
                        <option value="bachelors">Bachelors</option>
                        <option value="graduate">Graduate</option>
                      </select>
                    </td>
                    <td className="p-2">
                      {rows.length > 3 && (
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= 15}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              rows.length < 15
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Year ({rows.length}/15)
          </button>

          <div className="text-sm text-gray-600">
            <span className="font-semibold">{rows.length}</span> years tracked
            {rows.length < 3 && <span className="text-red-500 ml-2">(minimum 3 required)</span>}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              isValid
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <TrendingUp className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Step 4 of 5 - Income History
      </div>
    </motion.div>
  );
}
