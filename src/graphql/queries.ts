import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        content
        created_at
        sender_type
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender_type
      created_at
      chat_id
      user_id
    }
  }
`;

export const GET_CHAT_BY_ID = gql`
  query GetChatById($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      created_at
      updated_at
      user_id
      messages(order_by: { created_at: asc }) {
        id
        content
        sender_type
        created_at
        user_id
      }
    }
  }
`;