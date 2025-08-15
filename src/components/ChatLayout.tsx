import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { SEND_MESSAGE, CREATE_CHAT } from '../graphql/mutations';
import { GET_CHAT_MESSAGES, GET_USER_CHATS } from '../graphql/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { nhost } from '../nhost';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  lastUpdated: string;
}

interface ChatLayoutProps {
  onLogout: () => void;
}

export default function ChatLayout({ onLogout }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const user = nhost.auth.getUser();

  // Fetch user chats
  const { data: chatsData, loading: chatsLoading } = useQuery(GET_USER_CHATS, {
    variables: { user_id: user?.id },
    skip: !user
  });

  // Lazy query for messages
  const [loadMessages, { data: messagesData, loading: messagesLoading, error: messagesError }] =
    useLazyQuery(GET_CHAT_MESSAGES, {
      fetchPolicy: 'network-only', // Always fresh
    });

  // Load messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages({ variables: { chat_id: activeChat } })
        
        .catch((err) => {
          console.error("❌ Error loading messages:", err);
        });
    }
  }, [activeChat, loadMessages]);

  // Watch for returned data
  useEffect(() => {

    if (messagesError) {
      console.error("❌ Apollo message query error:", messagesError);
    }

    if (messagesData?.messages && Array.isArray(messagesData.messages)) {
      setMessages(
        messagesData.messages.map((m: any) => ({
          id: m.id,
          content: m.content,
          sender: m.sender,
          timestamp: new Date(m.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
      );
    }
  }, [messagesData, messagesError]);

  const [createChatMutation] = useMutation(CREATE_CHAT);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

  // Load chats and set first active chat
  useEffect(() => {

    if (!user || chatsLoading) return;

    if (chatsData?.chats?.length > 0) {
      setChats(chatsData.chats);
      if (!activeChat) {
        setActiveChat(chatsData.chats[0].id);
      }
    } else {
      createChatMutation({
        variables: {
          user_id: user.id,
          title: 'New Conversation'
        }
      }).then((res) => {
        if (res.data?.insert_chats_one) {
          const newChat = res.data.insert_chats_one;
          setChats([newChat]);
          setActiveChat(newChat.id);
        }
      });
    }
  }, [chatsLoading, chatsData, user, createChatMutation]);

  const handleSendMessage = async (content: string) => {
    if (!activeChat || !user) return;

    // Optimistic UI update
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const { data } = await sendMessageMutation({
        variables: {
          chat_id: activeChat,
          content,
          user_id: user.id
        }
      });


      if (data?.sendMessage?.reply) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.sendMessage.reply,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error(' Error sending message:', err);
    }
  };

  const handleNewChat = () => {
    if (!user) {
      console.error(' User not authenticated — cannot create chat');
      return;
    }

    createChatMutation({
      variables: {
        user_id: user.id,
        title: 'New Conversation'
      }
    })
      .then((res) => {
        if (res.data?.insert_chats_one) {
          const newChat = res.data.insert_chats_one;
          setChats((prev) => [newChat, ...prev]);
          setActiveChat(newChat.id);
          setMessages([]);
        }
      })
      .catch((err) => {
        console.error('❌ Error creating chat:', err);
      });
  };

  const handleChatSelect = (chatId: string) => {
    if (chatId !== activeChat) {
      setActiveChat(chatId);
    }
    setSidebarOpen(false);
  };

  if (chatsLoading) {
    return <div className="p-4">Loading chats...</div>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat || ''}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-lg font-semibold text-gray-900">ChatBot</h1>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {messagesLoading ? (
              <div className="text-gray-500">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            ) : (
              <div className="text-gray-400 italic">Send Message to start chat...</div>
            )}
          </div>
        </main>

        {/* Input */}
        {activeChat && <ChatInput onSendMessage={handleSendMessage} />}
      </div>
    </div>
  );
}
