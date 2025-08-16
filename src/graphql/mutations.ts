import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($userId: uuid!) {
    insert_chats_one(object: { user_id: $userId }) {
      id
      created_at
      updated_at
      user_id
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $senderType: String!) {
    insert_messages_one(
      object: { 
        chat_id: $chatId, 
        content: $content, 
        sender_type: $senderType 
      }
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

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_messages(where: { chat_id: { _eq: $chatId } }) {
      affected_rows
    }
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`;