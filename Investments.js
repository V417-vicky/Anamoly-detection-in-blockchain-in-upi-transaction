import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Shield, DollarSign, Check, AlertCircle, Info } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Investments() {
  const navigate = useNavigate();
  const { balance, addTransaction } = useTransaction();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const investmentCategories = [
    {
      id: 'mutual-funds',
      name: 'Mutual Funds',
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Invest in diversified portfolios',
      returns: '12-15% p.a.',
      risk: 'Medium',
    },
    {
      id: 'digital-gold',
      name: 'Digital Gold',
      icon: Shield,
      color: 'bg-yellow-500',
      description: 'Buy and sell digital gold',
      returns: '8-10% p.a.',
      risk: 'Low',
    },
    {
      id: 'fixed-deposit',
      name: 'Fixed Deposit',
      icon: DollarSign,
      color: 'bg-blue-500',
      description: 'Secure investment with guaranteed returns',
      returns: '6-7% p.a.',
      risk: 'Very Low',
    },
  ];

  const mutualFunds = [
    { name: 'HDFC Top 100 Fund', category: 'Large Cap', minInvestment: 500, returns: '14.2%' },
    { name: 'Axis Bluechip Fund', category: 'Large Cap', minInvestment: 500, returns: '13.8%' },
    { name: 'SBI Small Cap Fund', category: 'Small Cap', minInvestment: 1000, returns: '18.5%' },
    { name: 'ICICI Prudential Equity', category: 'Multi Cap', minInvestment: 500, returns: '12.9%' },
  ];

  const handleInvestment = () => {
    if (selectedCategory && amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `Investment - ${selectedCategory}`,
        recipient: 'Investment Platform',
        category: 'investment',
        subcategory: selectedCategory,
      });
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Successful!</h2>
          <p className="text-gray-600">₹{amount} invested in {selectedCategory}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Investments</h1>
      </div>

      {/* Investment Overview */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-green-100 text-sm mb-1">Total Investment Value</p>
            <h2 className="text-3xl font-bold">₹{(balance * 0.3).toLocaleString('en-IN')}</h2>
            <p className="text-green-100 text-sm mt-2">Available to invest: ₹{balance.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Investment Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Options</h3>
        <div className="space-y-3">
          {investmentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left ${
                  selectedCategory === category.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`${category.color} rounded-full p-3 mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-green-600">
                        <strong>Returns:</strong> {category.returns}
                      </span>
                      <span className="text-orange-600">
                        <strong>Risk:</strong> {category.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mutual Funds List */}
      {selectedCategory === 'mutual-funds' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Mutual Funds</h3>
          <div className="space-y-2">
            {mutualFunds.map((fund, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{fund.name}</p>
                    <p className="text-sm text-gray-500">{fund.category}</p>
                    <p className="text-xs text-gray-400 mt-1">Min: ₹{fund.minInvestment}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{fund.returns}</p>
                    <p className="text-xs text-gray-500">1 year return</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Form */}
      {selectedCategory && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Invest Now</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 5000, 10000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`py-2 rounded-lg border transition-colors ${
                    amount === quickAmount.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>

            <button
              onClick={handleInvestment}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Invest ₹{amount || '0'}
            </button>
          </div>
        </div>
      )}

      {/* Investment Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Investment Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start with small amounts and increase gradually</li>
              <li>• Diversify your investment portfolio</li>
              <li>• Consider your risk tolerance before investing</li>
              <li>• Review your investments regularly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Risk Warning</h4>
            <p className="text-sm text-yellow-800">
              All investments carry risk. Past performance is not indicative of future results. 
              Please invest responsibly and consult with financial advisors if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
