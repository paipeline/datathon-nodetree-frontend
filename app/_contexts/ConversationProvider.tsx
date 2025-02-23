"use client";

import { createContext, useContext, useState, useCallback } from 'react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated?: number;
};

type ConversationContextType = {
  historyRecords: Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversation: Conversation) => void;
  deleteConversation: (id: string) => void;
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [historyRecords, setHistoryRecords] = useState<Conversation[]>([]);

  const getConversationById = useCallback((id: string) => {
    return historyRecords.find(conv => conv.id === id);
  }, [historyRecords]);

  const addConversation = useCallback((conversation: Conversation) => {
    const newConversation = {
      ...conversation,
      lastUpdated: Date.now()
    };
    setHistoryRecords(prev => [newConversation, ...prev]);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setHistoryRecords(prev => prev.filter(conv => conv.id !== id));
  }, []);

  const updateConversation = useCallback((conversation: Conversation) => {
    setHistoryRecords(prev => {
      const updatedConversation = {
        ...conversation,
        lastUpdated: Date.now()
      };
      const filteredConversations = prev.filter(conv => conv.id !== conversation.id);
      return [updatedConversation, ...filteredConversations];
    });
  }, []);

  return (
    <ConversationContext.Provider value={{
      historyRecords,
      getConversationById,
      addConversation,
      updateConversation,
      deleteConversation,
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
