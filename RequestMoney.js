import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Send, Clock } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function RequestMoney() {
  const navigate = useNavigate();
  const { contacts } = useTransaction();
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestMoney = () => {
    if (selectedContact && amount && parseFloat(amount) > 0) {
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-600">₹{amount} requested from {selectedContact.name}</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Request Money</h1>
      </div>

      {/* Search Contact */}
      <div className="relative">
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Contacts List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Contact</h3>
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-colors ${
                selectedContact?.id === contact.id ? 'ring-2 ring-primary-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.upiId}</p>
                {contact.isSpam && (
                  <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    Spam
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Form */}
      {selectedContact && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selectedContact.name}</p>
              <p className="text-sm text-gray-500">{selectedContact.upiId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add a note"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={handleRequestMoney}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Request ₹{amount || '0'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Amounts */}
      {selectedContact && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</h3>
          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map((quickAmount) => (
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
        </div>
      )}

      {/* Recent Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Requests</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Rahul Sharma</p>
                <p className="text-sm text-gray-500">For dinner</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">₹500</p>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Priya Patel</p>
                <p className="text-sm text-gray-500">Movie tickets</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹300</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Received
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Request Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always add a clear reason for the request</li>
              <li>• Requests expire after 7 days</li>
              <li>• You can cancel pending requests anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
