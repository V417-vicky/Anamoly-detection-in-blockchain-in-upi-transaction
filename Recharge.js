import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Check } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Recharge() {
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const operators = [
    { name: 'Airtel', code: 'airtel' },
    { name: 'Jio', code: 'jio' },
    { name: 'Vi', code: 'vi' },
    { name: 'BSNL', code: 'bsnl' },
  ];

  const quickAmounts = [199, 299, 399, 499, 599, 799];

  const plans = [
    { operator: 'Airtel', amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited' },
    { operator: 'Airtel', amount: 399, validity: '56 days', data: '2GB/day', calls: 'Unlimited' },
    { operator: 'Jio', amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited' },
    { operator: 'Jio', amount: 499, validity: '56 days', data: '2GB/day', calls: 'Unlimited' },
    { operator: 'Vi', amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited' },
    { operator: 'Vi', amount: 499, validity: '56 days', data: '2GB/day', calls: 'Unlimited' },
  ];

  const handleRecharge = () => {
    if (phoneNumber && operator && amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `Mobile Recharge - ${operator}`,
        recipient: operator,
        phone: phoneNumber,
        category: 'recharge',
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recharge Successful!</h2>
          <p className="text-gray-600">₹{amount} recharged for {phoneNumber}</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Mobile Recharge</h1>
      </div>

      {/* Recharge Form */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Operator
            </label>
            <div className="grid grid-cols-2 gap-2">
              {operators.map((op) => (
                <button
                  key={op.code}
                  onClick={() => setOperator(op.name)}
                  className={`p-3 rounded-lg border transition-colors ${
                    operator === op.name
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {op.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter recharge amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Amounts
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`p-2 rounded-lg border transition-colors ${
                    amount === quickAmount.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRecharge}
            disabled={!phoneNumber || !operator || !amount || parseFloat(amount) <= 0}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Recharge ₹{amount || '0'}
          </button>
        </div>
      </div>

      {/* Popular Plans */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Plans</h3>
        <div className="space-y-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              onClick={() => {
                setOperator(plan.operator);
                setAmount(plan.amount.toString());
              }}
              className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center mb-1">
                    <Smartphone className="w-4 h-4 text-primary-600 mr-2" />
                    <span className="font-semibold text-gray-900">{plan.operator}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">₹{plan.amount}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Validity</p>
                  <p className="font-medium text-gray-900">{plan.validity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data</p>
                  <p className="font-medium text-gray-900">{plan.data}</p>
                </div>
                <div>
                  <p className="text-gray-500">Calls</p>
                  <p className="font-medium text-gray-900">{plan.calls}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharge History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Recharges</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-center py-4">No recent recharges</p>
        </div>
      </div>
    </div>
  );
}
