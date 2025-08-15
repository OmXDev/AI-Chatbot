import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  lastUpdated: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null; 
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

export default function ChatSidebar({ chats, activeChat, onChatSelect, onNewChat, isOpen }: ChatSidebarProps) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Chats</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`
                  w-full text-left p-3 rounded-md border transition-colors
                  ${activeChat === chat.id
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{chat.lastUpdated}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}