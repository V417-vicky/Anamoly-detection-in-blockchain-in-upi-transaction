import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Droplet, Flame, Wifi, Tv, Check, CreditCard } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function BillPayments() {
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [operator, setOperator] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const billCategories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
    { id: 'water', name: 'Water', icon: Droplet, color: 'bg-blue-500' },
    { id: 'gas', name: 'Gas', icon: Flame, color: 'bg-orange-500' },
    { id: 'broadband', name: 'Broadband', icon: Wifi, color: 'bg-purple-500' },
    { id: 'dth', name: 'DTH', icon: Tv, color: 'bg-red-500' },
  ];

  const operators = {
    electricity: [
      { name: 'BSES Rajdhani', code: 'bses-rajdhani' },
      { name: 'BSES Yamuna', code: 'bses-yamuna' },
      { name: 'MSEB', code: 'mseb' },
      { name: 'DJB', code: 'djb' },
    ],
    water: [
      { name: 'Delhi Jal Board', code: 'djb-water' },
      { name: 'Mumbai Water', code: 'mumbai-water' },
      { name: 'Bangalore Water', code: 'bwssb' },
    ],
    gas: [
      { name: 'Indane Gas', code: 'indane' },
      { name: 'Bharat Gas', code: 'bharat' },
      { name: 'HP Gas', code: 'hp' },
    ],
    broadband: [
      { name: 'Airtel Broadband', code: 'airtel-broadband' },
      { name: 'Jio Fiber', code: 'jio-fiber' },
      { name: 'BSNL Broadband', code: 'bsnl-broadband' },
    ],
    dth: [
      { name: 'Tata Sky', code: 'tata-sky' },
      { name: 'Airtel DTH', code: 'airtel-dth' },
      { name: 'Dish TV', code: 'dish-tv' },
      { name: 'Sun Direct', code: 'sun-direct' },
    ],
  };

  const handlePayment = () => {
    if (selectedCategory && operator && consumerNumber && amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Bill - ${operator}`,
        recipient: operator,
        consumerNumber: consumerNumber,
        category: 'bill',
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">₹{amount} paid for {selectedCategory} bill</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Bill Payments</h1>
      </div>

      {/* Bill Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
        <div className="grid grid-cols-3 gap-4">
          {billCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                  selectedCategory === category.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className={`${category.color} rounded-full p-3 mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Selection */}
      {selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Operator</h3>
          <div className="space-y-2">
            {operators[selectedCategory]?.map((op) => (
              <button
                key={op.code}
                onClick={() => setOperator(op.name)}
                className={`w-full p-3 bg-white rounded-lg shadow-sm text-left transition-colors ${
                  operator === op.name
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-900">{op.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form */}
      {selectedCategory && operator && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Number
              </label>
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="Enter your consumer number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter bill amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={!consumerNumber || !amount || parseFloat(amount) <= 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Pay ₹{amount || '0'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Payments</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="font-medium text-gray-900">BSES Rajdhani</span>
                </div>
                <p className="text-sm text-gray-500">Consumer: DL123456789</p>
                <p className="text-xs text-gray-400">Paid on 10 Mar 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹1,245</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Success
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <Tv className="w-4 h-4 text-red-500 mr-2" />
                  <span className="font-medium text-gray-900">Tata Sky</span>
                </div>
                <p className="text-sm text-gray-500">Consumer: TS987654321</p>
                <p className="text-xs text-gray-400">Paid on 5 Mar 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹450</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Success
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <Wifi className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="font-medium text-gray-900">Jio Fiber</span>
                </div>
                <p className="text-sm text-gray-500">Consumer: JF123456789</p>
                <p className="text-xs text-gray-400">Paid on 1 Mar 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹699</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Success
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <CreditCard className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Payment Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Double-check consumer number before payment</li>
              <li>• Save consumer numbers for quick recharges</li>
              <li>• Payments are usually processed instantly</li>
              <li>• Download receipts for future reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
