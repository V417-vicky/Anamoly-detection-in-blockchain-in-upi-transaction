import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, X } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function History() {
  const { transactions } = useTransaction();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.upiId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    return filtered;
  }, [transactions, searchQuery, filterType]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  const groupTransactionsByDate = (transactions) => {
    const grouped = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = {
          date: formatDate(transaction.timestamp),
          transactions: []
        };
      }
      grouped[date].transactions.push(transaction);
    });

    return Object.values(grouped);
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h1>
        
        {/* Search and Filter */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters || filterType !== 'all'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Filter by Type</span>
              {filterType !== 'all' && (
                <button
                  onClick={() => setFilterType('all')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterType === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('credit')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterType === 'credit'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('debit')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterType === 'debit'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Income</span>
            <ArrowDownLeft className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">+₹{totalIncome.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.type === 'credit').length} transactions
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Total Expense</span>
            <ArrowUpRight className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">-₹{totalExpense.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredTransactions.filter(t => t.type === 'debit').length} transactions
          </p>
        </div>
      </div>

      {/* Transactions List */}
      {groupedTransactions.length > 0 ? (
        <div className="space-y-4">
          {groupedTransactions.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">{group.date}</span>
              </div>
              <div className="space-y-2">
                {group.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="transaction-item bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          {transaction.recipient && (
                            <p className="text-sm text-gray-500">To: {transaction.recipient}</p>
                          )}
                          {transaction.upiId && (
                            <p className="text-sm text-gray-500">UPI: {transaction.upiId}</p>
                          )}
                          {transaction.note && (
                            <p className="text-sm text-gray-500 italic">Note: {transaction.note}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(transaction.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold text-lg ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start making transactions to see them here'
            }
          </p>
        </div>
      )}
    </div>
  );
}
