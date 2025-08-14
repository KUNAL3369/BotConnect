import { gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chatId: uuid!) {
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

export const CHATS_SUBSCRIPTION = gql`
  subscription ChatsSubscription {
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