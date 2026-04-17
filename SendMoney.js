import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, AlertTriangle, Check } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function SendMoney() {
  const navigate = useNavigate();
  const { contacts, recentRecipients, addTransaction, addRecentRecipient, markAsSpam } = useTransaction();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMoney = () => {
    if (selectedContact && amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `Sent to ${selectedContact.name}`,
        recipient: selectedContact.name,
        upiId: selectedContact.upiId,
        note: note,
      });
      addRecentRecipient(selectedContact);
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const handleMarkSpam = (contactId) => {
    markAsSpam(contactId);
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Money Sent!</h2>
          <p className="text-gray-600">₹{amount} sent to {selectedContact.name}</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Send Money</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone or UPI ID"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Recent Recipients */}
      {recentRecipients.length > 0 && !searchQuery && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent</h3>
          <div className="space-y-2">
            {recentRecipients.map((recipient) => (
              <div
                key={recipient.id}
                onClick={() => handleContactSelect(recipient)}
                className={`flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-colors ${
                  selectedContact?.id === recipient.id ? 'ring-2 ring-primary-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900">{recipient.name}</p>
                    {recipient.isSpam && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Spam
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{recipient.upiId}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkSpam(recipient.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Contacts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">All Contacts</h3>
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className={`flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-colors ${
                selectedContact?.id === contact.id ? 'ring-2 ring-primary-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  {contact.isSpam && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Spam
                    </span>
                  )}
                  {contact.spamReason && (
                    <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full" title={`Spam Reason: ${contact.spamReason}`}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {contact.spamReason.length > 20 ? 'High Risk' : 'Spam'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{contact.upiId}</p>
                <p className="text-xs text-gray-400">{contact.phone}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkSpam(contact.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {selectedContact && (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selectedContact.name}</p>
              <p className="text-sm text-gray-500">{selectedContact.upiId}</p>
            </div>
          </div>

          {selectedContact.isSpam && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Warning: Spam User</p>
                  <p className="text-xs text-red-600">This user has been flagged as spam. Proceed with caution.</p>
                </div>
              </div>
            </div>
          )}

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
                Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add a note"
              />
            </div>
            <button
              onClick={handleSendMoney}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send ₹{amount || '0'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
