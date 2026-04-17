import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Shield, Wallet as WalletIcon } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Wallet() {
  const navigate = useNavigate();
  const { balance, addMoney } = useTransaction();
  const [amount, setAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [savedCards] = useState([
    { id: 1, last4: '4242', brand: 'Visa', name: 'John Doe', isDefault: true },
    { id: 2, last4: '5555', brand: 'Mastercard', name: 'John Doe', isDefault: false },
  ]);

  const handleAddMoney = () => {
    if (amount && parseFloat(amount) > 0) {
      addMoney(parseFloat(amount), 'Money Added to Wallet');
      setAmount('');
      setShowAddMoney(false);
    }
  };

  const handleAddCard = () => {
    if (cardForm.cardNumber && cardForm.cardName && cardForm.expiry && cardForm.cvv) {
      setShowAddCard(false);
      setCardForm({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    }
  };

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
        <h1 className="text-xl font-semibold text-gray-900">Wallet</h1>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">Wallet Balance</p>
            <h2 className="text-3xl font-bold">₹{balance.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <WalletIcon className="w-6 h-6" />
          </div>
        </div>
        <button
          onClick={() => setShowAddMoney(true)}
          className="w-full bg-white text-primary-600 px-4 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Add Money
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddCard(true)}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-medium text-gray-900">Add Card</span>
          </div>
          <p className="text-sm text-gray-500">Link new card</p>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-medium text-gray-900">Security</span>
          </div>
          <p className="text-sm text-gray-500">Manage settings</p>
        </button>
      </div>

      {/* Saved Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Cards</h3>
        <div className="space-y-3">
          {savedCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center mr-3">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{card.brand} •••• {card.last4}</p>
                    <p className="text-sm text-gray-500">{card.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {card.isDefault && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <WalletIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">UPI Wallet</p>
                  <p className="text-sm text-gray-500">Default payment method</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Credit/Debit Cards</p>
                  <p className="text-sm text-gray-500">{savedCards.length} cards saved</p>
                </div>
              </div>
              <button className="text-primary-600 text-sm font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>
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
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 2000].map((quickAmount) => (
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

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Card</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardForm.cardName}
                onChange={(e) => setCardForm({...cardForm, cardName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddCard}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Card
              </button>
              <button
                onClick={() => setShowAddCard(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
