import { gql } from '@apollo/client';

export const GET_USER_CHATS = gql`
  query GetUserChats($user_id: uuid!) {
    chats(
      where: { user_id: { _eq: $user_id } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

