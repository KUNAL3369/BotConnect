import { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { GET_CHATS, GET_CHAT_MESSAGES } from '../graphql/queries';
import { CHATS_SUBSCRIPTION, MESSAGES_SUBSCRIPTION } from '../graphql/subscriptions';
import { CREATE_CHAT, CREATE_MESSAGE, UPDATE_CHAT_TIMESTAMP } from '../graphql/mutations';
import { Chat, Message } from '../types';

export function useChat() {
  const user = useUserData();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Fetch all chats for the user
  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS, {
    skip: !user,
  });

  // Subscribe to chats updates
  const { data: chatsSubscriptionData } = useSubscription(CHATS_SUBSCRIPTION, {
    skip: !user,
  });

  // Subscribe to messages for current chat
  const { data: messagesSubscriptionData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: currentChatId },
    skip: !currentChatId,
  });

  // Fallback query for messages when subscription is not available
  const { data: messagesData, loading: messagesLoading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: currentChatId },
    skip: !currentChatId,
  });

  // Mutations
  const [createChatMutation] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      setCurrentChatId(data.insert_chats_one.id);
    },
  });

  const [createMessageMutation] = useMutation(CREATE_MESSAGE);

  const [updateChatTimestamp] = useMutation(UPDATE_CHAT_TIMESTAMP);

  // Helper functions
  const createChat = async (title: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await createChatMutation({
        variables: { 
          userId: user.id
        },
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const sendMessage = async (content: string, senderType: 'user' | 'bot' = 'user') => {
    if (!currentChatId) {
      throw new Error('No active chat');
    }

    try {
      await createMessageMutation({
        variables: {
          chatId: currentChatId,
          content,
          senderType,
        },
      });

      // Update chat timestamp
      await updateChatTimestamp({
        variables: { 
          chatId: currentChatId,
          updatedAt: new Date().toISOString()
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting question! Let me think about that for you.",
      "I understand what you're asking. Here's what I can tell you about that topic.",
      "Great question! I'm here to help you with that.",
      "I see what you mean. Let me provide you with some information.",
      "Thanks for asking! I'd be happy to help you with that.",
      "That's a good point you're making. Here's my perspective on it.",
      "I appreciate you sharing that with me. Let me respond thoughtfully.",
    ];

    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! It's great to hear from you. What would you like to talk about?";
    }

    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! You can ask me about various topics, and I'll do my best to provide useful information and assistance.";
    }

    if (userMessage.toLowerCase().includes('weather')) {
      return "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for the most current conditions in your area.";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendBotResponse = async (userMessage: string) => {
    const botResponse = generateBotResponse(userMessage);
    
    // Add a delay to simulate bot thinking
    setTimeout(async () => {
      try {
        await sendMessage(botResponse, 'bot');
      } catch (error) {
        console.error('Error sending bot response:', error);
      }
    }, 1000 + Math.random() * 1000);
  };

  // Use subscription data if available, otherwise fall back to query data
  const chats = chatsSubscriptionData?.chats || chatsData?.chats || [];
  const messages = messagesSubscriptionData?.messages || messagesData?.messages || [];

  return {
    // Data
    chats: chats as Chat[],
    messages: messages as Message[],
    currentChatId,
    
    // Loading states
    chatsLoading,
    messagesLoading,
    
    // Actions
    createChat,
    sendMessage,
    sendBotResponse,
    setCurrentChatId,
  };
}