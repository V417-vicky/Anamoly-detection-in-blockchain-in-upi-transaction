import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Check, Calendar } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function ElectricityBill() {
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();
  const [consumerNumber, setConsumerNumber] = useState('');
  const [board, setBoard] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const electricityBoards = [
    { name: 'BSES Rajdhani', code: 'bses-rajdhani' },
    { name: 'BSES Yamuna', code: 'bses-yamuna' },
    { name: 'MSEB', code: 'mseb' },
    { name: 'DJB', code: 'djb' },
    { name: 'NESCO', code: 'nesco' },
    { name: 'WESCO', code: 'wesco' },
  ];

  const handlePayment = () => {
    if (consumerNumber && board && amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `Electricity Bill - ${board}`,
        recipient: board,
        consumerNumber: consumerNumber,
        category: 'bill',
        subcategory: 'electricity',
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
          <p className="text-gray-600">₹{amount} paid for electricity bill</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Electricity Bill</h1>
      </div>

      {/* Bill Payment Form */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Electricity Board
            </label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Board</option>
              {electricityBoards.map((board) => (
                <option key={board.code} value={board.name}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

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
            disabled={!consumerNumber || !board || !amount || parseFloat(amount) <= 0}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Pay ₹{amount || '0'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium text-gray-900">View Bill</span>
            </div>
            <p className="text-sm text-gray-500">Check your current bill</p>
          </button>
          <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium text-gray-900">Payment History</span>
            </div>
            <p className="text-sm text-gray-500">View past payments</p>
          </button>
        </div>
      </div>

      {/* Bill Information */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Bill Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Due Date:</span>
            <span className="font-medium text-blue-900">15th of every month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Late Payment Fee:</span>
            <span className="font-medium text-blue-900">2% per month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Payment Methods:</span>
            <span className="font-medium text-blue-900">UPI, Net Banking</span>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Payments</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">BSES Rajdhani</p>
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
                <p className="font-medium text-gray-900">BSES Rajdhani</p>
                <p className="text-sm text-gray-500">Consumer: DL123456789</p>
                <p className="text-xs text-gray-400">Paid on 10 Feb 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹980</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Success
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Saving Tips */}
      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">💡 Energy Saving Tips</h4>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• Use LED bulbs to save up to 75% energy</li>
          <li>• Turn off appliances when not in use</li>
          <li>• Use natural light during daytime</li>
          <li>• Set AC temperature to 24°C for optimal efficiency</li>
        </ul>
      </div>
    </div>
  );
}
