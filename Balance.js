import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Balance() {
  const { balance, transactions, addMoney } = useTransaction();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const handleAddMoney = () => {
    if (amount && parseFloat(amount) > 0) {
      addMoney(parseFloat(amount), description || 'Money Added to Wallet');
      setAmount('');
      setDescription('');
      setShowAddMoney(false);
    }
  };

  const recentTransactions = transactions.slice(0, 10);

  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-100 text-sm mb-1">Total Balance</p>
            <h2 className="text-4xl font-bold">₹{balance.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              <span className="text-xs text-primary-100">Income</span>
            </div>
            <p className="text-lg font-semibold">₹{totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-xs text-primary-100">Expense</span>
            </div>
            <p className="text-lg font-semibold">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddMoney(true)}
          className="w-full bg-white text-primary-600 px-4 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Add Money
        </button>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Money to Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter description"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddMoney}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Money
              </button>
              <button
                onClick={() => setShowAddMoney(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Growth</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">+12.5%</p>
          <p className="text-xs text-gray-500">vs last month</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹8,450</p>
          <p className="text-xs text-gray-500">net balance</p>
        </div>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
