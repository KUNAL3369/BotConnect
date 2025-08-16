import { gql } from '@apollo/client';

// 1️⃣ Create Chat (do NOT include updated_at)
export const CREATE_CHAT = gql`
  mutation CreateChat($userId: uuid!) {
    insert_chats_one(object: { user_id: $userId, title: "Chat with Bot" }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

// 2️⃣ Send Message
export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $senderType: String!) {
    insert_messages_one(
      object: { 
        chat_id: $chatId, 
        content: $content, 
        sender_type: $senderType,
        is_from_bot: false
      }
    ) {
      id
      content
      sender_type
      is_from_bot
      created_at
      chat_id
      user_id
    }
  }
`;

// 3️⃣ Optional: Update chat timestamp manually (usually your trigger handles this)
export const UPDATE_CHAT_TIMESTAMP = gql`
  mutation UpdateChatTimestamp($chatId: uuid!) {
    update_chats_by_pk(
      pk_columns: { id: $chatId }
      _set: { updated_at: now() }
    ) {
      id
      updated_at
    }
  }
`;

// 4️⃣ Optional: Delete chat and messages
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