import React, { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext();

const initialState = {
  messages: [],
  spamUsers: new Set([3, 5]), // User IDs marked as spam
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      const newMessage = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    case 'MARK_USER_SPAM':
      return {
        ...state,
        spamUsers: new Set([...state.spamUsers, action.payload]),
      };
    case 'UNMARK_USER_SPAM':
      const newSpamUsers = new Set(state.spamUsers);
      newSpamUsers.delete(action.payload);
      return {
        ...state,
        spamUsers: newSpamUsers,
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const markUserAsSpam = (userId) => {
    dispatch({ type: 'MARK_USER_SPAM', payload: userId });
  };

  const unmarkUserAsSpam = (userId) => {
    dispatch({ type: 'UNMARK_USER_SPAM', payload: userId });
  };

  const isUserSpam = (userId) => {
    return state.spamUsers.has(userId);
  };

  const value = {
    ...state,
    addMessage,
    markUserAsSpam,
    unmarkUserAsSpam,
    isUserSpam,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
