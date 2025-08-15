import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!, $user_id: uuid!) {
    sendMessage(chat_id: $chat_id, content: $content, user_id: $user_id) {
      reply
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
  insert_chats_one(object: { title: $title, user_id: $user_id }) {
    id
    title
    created_at
    user_id
  }
}

`;
