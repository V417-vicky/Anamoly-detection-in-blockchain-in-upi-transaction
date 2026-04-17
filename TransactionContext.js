import React, { createContext, useContext, useReducer } from 'react';

const TransactionContext = createContext();

const initialState = {
  balance: 5000,
  transactions: [],
  contacts: [
    { id: 1, name: 'Rahul Sharma', phone: '9876543210', upiId: 'rahul@upi', isSpam: false, spamReason: '' },
    { id: 2, name: 'Priya Patel', phone: '9876543211', upiId: 'priya@upi', isSpam: false, spamReason: '' },
    { id: 3, name: 'Amit Kumar', phone: '9876543212', upiId: 'amit@upi', isSpam: true, spamReason: 'Multiple transaction disputes, suspicious activity patterns' },
    { id: 4, name: 'Sneha Reddy', phone: '9876543213', upiId: 'sneha@upi', isSpam: false, spamReason: '' },
    { id: 5, name: 'Unknown User', phone: '9876543214', upiId: 'unknown@upi', isSpam: true, spamReason: 'Fake profile information, requests for large amounts' },
    { id: 6, name: 'Vikram Singh', phone: '9876543215', upiId: 'vikram@upi', isSpam: false, spamReason: '' },
    { id: 7, name: 'Anjali Gupta', phone: '9876543216', upiId: 'anjali@upi', isSpam: false, spamReason: '' },
    { id: 8, name: 'Rohit Kumar', phone: '9876543217', upiId: 'rohit@upi', isSpam: true, spamReason: 'Frequent money requests from unknown contacts' },
    { id: 9, name: 'Kavita Verma', phone: '9876543218', upiId: 'kavita@upi', isSpam: false, spamReason: '' },
    { id: 10, name: 'Neha Sharma', phone: '9876543219', upiId: 'neha@upi', isSpam: false, spamReason: '' },
    { id: 11, name: 'Pankaj Tripathi', phone: '9876543220', upiId: 'pankaj@upi', isSpam: true, spamReason: 'Reported for fraudulent transactions, multiple user complaints' },
    { id: 12, name: 'Meera Joshi', phone: '9876543221', upiId: 'meera@upi', isSpam: true, spamReason: 'Phishing attempts, fake payment requests' },
    { id: 13, name: 'Suresh Raina', phone: '9876543222', upiId: 'suresh@upi', isSpam: false, spamReason: '' },
    { id: 14, name: 'Deepika Singh', phone: '9876543223', upiId: 'deepika@upi', isSpam: false, spamReason: '' },
    { id: 15, name: 'Arjun Verma', phone: '9876543224', upiId: 'arjun@upi', isSpam: true, spamReason: 'Suspicious transaction history, unusual payment patterns' },
  ],
  recentRecipients: [],
};

function transactionReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      const newTransaction = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
        balance: state.balance - action.payload.amount,
      };
    case 'ADD_MONEY':
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        transactions: [
          {
            id: Date.now(),
            type: 'credit',
            amount: action.payload.amount,
            description: action.payload.description || 'Money Added',
            timestamp: new Date().toISOString(),
          },
          ...state.transactions,
        ],
      };
    case 'ADD_RECENT_RECIPIENT':
      const exists = state.recentRecipients.find(r => r.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        recentRecipients: [action.payload, ...state.recentRecipients.slice(0, 4)],
      };
    case 'MARK_SPAM':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload
            ? { ...contact, isSpam: true }
            : contact
        ),
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addMoney = (amount, description) => {
    dispatch({ type: 'ADD_MONEY', payload: { amount, description } });
  };

  const addRecentRecipient = (contact) => {
    dispatch({ type: 'ADD_RECENT_RECIPIENT', payload: contact });
  };

  const markAsSpam = (contactId) => {
    dispatch({ type: 'MARK_SPAM', payload: contactId });
  };

  const getRandomSpamReason = () => {
    const reasons = [
      'Multiple transaction disputes, suspicious activity patterns',
      'Fake profile information, requests for large amounts',
      'Frequent money requests from unknown contacts',
      'Reported for fraudulent transactions, multiple user complaints',
      'Phishing attempts, fake payment requests',
      'Suspicious transaction history, unusual payment patterns',
      'Reported for fraudulent transactions, multiple user complaints',
      'Phishing attempts, fake payment requests',
      'Suspicious transaction history, unusual payment patterns'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getTransactionStats = () => {
    const spamTransactions = state.transactions.filter(t => {
      // Consider transactions with spam users as spam transactions
      const contact = state.contacts.find(c => c.name === t.recipient);
      return contact && contact.isSpam;
    });
    
    const safeTransactions = state.transactions.filter(t => {
      const contact = state.contacts.find(c => c.name === t.recipient);
      return !contact || !contact.isSpam;
    });

    return {
      safe: safeTransactions.length,
      spam: spamTransactions.length,
      total: state.transactions.length
    };
  };

  const value = {
    ...state,
    addTransaction,
    addMoney,
    addRecentRecipient,
    markAsSpam,
    getRandomSpamReason,
    getTransactionStats,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}
