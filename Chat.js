import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Search, AlertTriangle, User, Phone, Shield, X } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';
import { useChat } from '../context/ChatContext';

export default function Chat() {
  const { contacts } = useTransaction();
  const { messages, addMessage, isUserSpam, markUserAsSpam, unmarkUserAsSpam } = useChat();
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpamWarning, setShowSpamWarning] = useState(false);
  const messagesEndRef = useRef(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactMessages = useMemo(() => selectedContact
    ? messages.filter(msg => msg.contactId === selectedContact.id)
    : [], [selectedContact, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contactMessages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedContact) {
      addMessage({
        contactId: selectedContact.id,
        text: messageInput.trim(),
        sender: 'me',
        contactName: selectedContact.name,
      });
      setMessageInput('');

      // Simulate received message after a delay
      setTimeout(() => {
        const responses = [
          'Thanks for your message!',
          'Sure, I understand.',
          'Let me check and get back to you.',
          'Okay, sounds good!',
          'I appreciate your help.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addMessage({
          contactId: selectedContact.id,
          text: randomResponse,
          sender: 'other',
          contactName: selectedContact.name,
        });
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    if (contact.isSpam || isUserSpam(contact.id)) {
      setShowSpamWarning(true);
    }
  };

  const handleMarkSpam = (contactId) => {
    markUserAsSpam(contactId);
    const updatedContact = contacts.find(c => c.id === contactId);
    if (updatedContact) {
      updatedContact.isSpam = true;
    }
  };

  const handleUnmarkSpam = (contactId) => {
    unmarkUserAsSpam(contactId);
    const updatedContact = contacts.find(c => c.id === contactId);
    if (updatedContact) {
      updatedContact.isSpam = false;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts List */}
        <div className={`${selectedContact ? 'hidden md:block' : 'block'} w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => {
              const isSpam = contact.isSpam || isUserSpam(contact.id);
              const lastMessage = messages
                .filter(msg => msg.contactId === contact.id)
                .slice(-1)[0];

              return (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                        {isSpam && (
                          <div className="ml-2">
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Spam
                            </span>
                            {contact.spamReason && (
                              <p className="text-xs text-orange-600 mt-1 truncate" title={`Spam Reason: ${contact.spamReason}`}>
                                {contact.spamReason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{contact.upiId}</p>
                      {lastMessage && (
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {lastMessage.sender === 'me' ? 'You: ' : ''}
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {lastMessage && (
                        <p className="text-xs text-gray-400">
                          {formatTime(lastMessage.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-semibold text-gray-900">{selectedContact.name}</p>
                      {(selectedContact.isSpam || isUserSpam(selectedContact.id)) && (
                        <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Spam
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{selectedContact.upiId}</p>
                    {selectedContact.spamReason && (selectedContact.isSpam || isUserSpam(selectedContact.id)) && (
                      <p className="text-xs text-orange-600 mt-1" title={`Spam Reason: ${selectedContact.spamReason}`}>
                        <AlertTriangle className="w-3 h-3 mr-1 inline" />
                        {selectedContact.spamReason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  {(selectedContact.isSpam || isUserSpam(selectedContact.id)) ? (
                    <button
                      onClick={() => handleUnmarkSpam(selectedContact.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Remove from spam"
                    >
                      <Shield className="w-5 h-5 text-green-600" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkSpam(selectedContact.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Mark as spam"
                    >
                      <AlertTriangle className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Spam Warning */}
              {(selectedContact.isSpam || isUserSpam(selectedContact.id)) && showSpamWarning && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Spam Warning</p>
                      <p className="text-xs text-red-600 mt-1">
                        This user has been flagged as spam. Be cautious with personal information and financial transactions.
                      </p>
                      <button
                        onClick={() => setShowSpamWarning(false)}
                        className="text-xs text-red-700 hover:text-red-800 mt-2"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {contactMessages.length > 0 ? (
                contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation with {selectedContact.name}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${selectedContact.name}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a contact</h3>
              <p className="text-gray-500">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
